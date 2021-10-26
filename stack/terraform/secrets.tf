resource "aws_secretsmanager_secret" "weather-api-secret" {
    name = "${var.stack_name}-${terraform.workspace}-weather-api-secret"
}