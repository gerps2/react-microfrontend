provider "aws" {
  region = "sa-east-1"
}

resource "aws_s3_bucket" "microfrontend_bucket" {
  bucket = "my-microfrontend-bucket"
}

resource "aws_s3_bucket_public_access_block" "microfrontend_bucket_public_access_block" {
  bucket                  = aws_s3_bucket.microfrontend_bucket.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "microfrontend_bucket_policy" {
  bucket = aws_s3_bucket.microfrontend_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = "*"
        Action = "s3:GetObject"
        Resource = "${aws_s3_bucket.microfrontend_bucket.arn}/*"
      }
    ]
  })
}

resource "aws_cloudfront_distribution" "app_distribution" {
  origin {
    domain_name = aws_s3_bucket.microfrontend_bucket.bucket_regional_domain_name
    origin_id   = "appS3Origin"
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "appS3Origin"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

output "app_distribution_id" {
  value = aws_cloudfront_distribution.app_distribution.id
}

output "app_distribution_domain_name" {
  value = aws_cloudfront_distribution.app_distribution.domain_name
}