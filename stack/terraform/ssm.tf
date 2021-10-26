resource "aws_ssm_parameter" "weather-api-secret-arn" {
    name  = "${var.stack_name}-${terraform.workspace}-weather-api-secret-arn"
    type  = "String"
    value = aws_secretsmanager_secret.weather-api-secret.arn
}