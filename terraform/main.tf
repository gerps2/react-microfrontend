# Configuração do provedor AWS
provider "aws" {
  region = "sa-east-1"
}

# Variáveis
variable "app_name" {
  description = "Nome da aplicação"
  default     = "react-microfrontend"
}

variable "environment" {
  description = "Ambiente de deploy"
  default     = "prod"
}

# Identidade da conta AWS
data "aws_caller_identity" "current" {}

# Bucket S3
resource "aws_s3_bucket" "microfrontend_bucket" {
  bucket = "${var.app_name}-${var.environment}-${data.aws_caller_identity.current.account_id}"

  tags = {
    Name        = "Microfrontend Bucket"
    Environment = var.environment
  }
}

# Desabilita uso de ACLs (modo recomendado pela AWS)
resource "aws_s3_bucket_ownership_controls" "ownership" {
  bucket = aws_s3_bucket.microfrontend_bucket.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

# Website estático
resource "aws_s3_bucket_website_configuration" "microfrontend_website" {
  bucket = aws_s3_bucket.microfrontend_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

# CORS
resource "aws_s3_bucket_cors_configuration" "microfrontend_cors" {
  bucket = aws_s3_bucket.microfrontend_bucket.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

# Acesso público
resource "aws_s3_bucket_public_access_block" "microfrontend_bucket_public_access_block" {
  bucket                  = aws_s3_bucket.microfrontend_bucket.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# Política pública
resource "aws_s3_bucket_policy" "microfrontend_bucket_policy" {
  bucket = aws_s3_bucket.microfrontend_bucket.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid       = "PublicReadGetObject",
        Effect    = "Allow",
        Principal = "*",
        Action    = "s3:GetObject",
        Resource  = "${aws_s3_bucket.microfrontend_bucket.arn}/*"
      }
    ]
  })

  depends_on = [
    aws_s3_bucket_public_access_block.microfrontend_bucket_public_access_block,
    aws_s3_bucket_ownership_controls.ownership
  ]
}

# CloudFront
resource "aws_cloudfront_distribution" "app_distribution" {
  origin {
    domain_name = aws_s3_bucket_website_configuration.microfrontend_website.website_endpoint
    origin_id   = "appS3Origin"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100"
  comment             = "Distribuição para ${var.app_name} - Container Principal"

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "appS3Origin"

    forwarded_values {
      query_string = true
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true
  }

  # Comportamentos ordenados por rota
  dynamic "ordered_cache_behavior" {
    for_each = toset(["/app/*", "/carrinho/*", "/produtos/*"])
    content {
      path_pattern     = ordered_cache_behavior.value
      allowed_methods  = ["GET", "HEAD", "OPTIONS"]
      cached_methods   = ["GET", "HEAD"]
      target_origin_id = "appS3Origin"

      forwarded_values {
        query_string = true
        cookies {
          forward = "none"
        }
      }

      viewer_protocol_policy = "redirect-to-https"
      min_ttl                = 0
      default_ttl            = 3600
      max_ttl                = 86400
      compress               = true
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Name        = "${var.app_name}-distribution"
    Environment = var.environment
  }
}

# Outputs
output "app_distribution_id" {
  value = aws_cloudfront_distribution.app_distribution.id
}

output "app_distribution_domain_name" {
  value = aws_cloudfront_distribution.app_distribution.domain_name
}

output "s3_bucket_name" {
  value = aws_s3_bucket.microfrontend_bucket.id
}

output "s3_website_endpoint" {
  value = aws_s3_bucket_website_configuration.microfrontend_website.website_endpoint
}
