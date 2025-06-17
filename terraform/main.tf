# Configuração do provedor AWS
provider "aws" {
  region = "sa-east-1"
}

# Variáveis para facilitar a manutenção
variable "app_name" {
  description = "Nome da aplicação"
  default     = "react-microfrontend"
}

variable "environment" {
  description = "Ambiente de deploy"
  default     = "prod"
}

# Bucket S3 para hospedar os microfrontends
resource "aws_s3_bucket" "microfrontend_bucket" {
  bucket = "${var.app_name}-${var.environment}-${data.aws_caller_identity.current.account_id}"
  tags = {
    Name        = "Microfrontend Bucket"
    Environment = var.environment
  }
}

# Obter a identidade da conta atual
data "aws_caller_identity" "current" {}

# Configuração para website estático
resource "aws_s3_bucket_website_configuration" "microfrontend_website" {
  bucket = aws_s3_bucket.microfrontend_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"  # Importante para SPAs com React Router
  }
}

# Configuração de CORS para permitir comunicação entre microfrontends
resource "aws_s3_bucket_cors_configuration" "microfrontend_cors" {
  bucket = aws_s3_bucket.microfrontend_bucket.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["*"]  # Em produção, restrinja para seus domínios específicos
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

# Configuração de acesso público
resource "aws_s3_bucket_public_access_block" "microfrontend_bucket_public_access_block" {
  bucket                  = aws_s3_bucket.microfrontend_bucket.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# Política de acesso ao bucket
resource "aws_s3_bucket_policy" "microfrontend_bucket_policy" {
  bucket = aws_s3_bucket.microfrontend_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.microfrontend_bucket.arn}/*"
      }
    ]
  })

  # Garantir que a política só seja aplicada após a configuração de acesso público
  depends_on = [aws_s3_bucket_public_access_block.microfrontend_bucket_public_access_block]
}

# Distribuição CloudFront para o container principal (app)
resource "aws_cloudfront_distribution" "app_distribution" {
  origin {
    domain_name = aws_s3_bucket.microfrontend_bucket.bucket_regional_domain_name
    origin_id   = "appS3Origin"

    # Configuração personalizada para o S3
    s3_origin_config {
      origin_access_identity = "" # Deixamos vazio pois o bucket é público
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100" # Usar apenas locais mais baratos (América do Norte e Europa)
  comment             = "Distribuição para ${var.app_name} - Container Principal"

  # Configuração para SPA (Single Page Application)
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
      query_string = true # Importante para rotas com parâmetros
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true # Habilitar compressão para melhor performance
  }

  # Comportamento de cache específico para microfrontends
  ordered_cache_behavior {
    path_pattern     = "/app/*"
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

  ordered_cache_behavior {
    path_pattern     = "/carrinho/*"
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

  ordered_cache_behavior {
    path_pattern     = "/produtos/*"
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

# Outputs para referência
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