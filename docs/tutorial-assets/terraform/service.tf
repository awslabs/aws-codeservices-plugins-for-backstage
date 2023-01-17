resource "aws_ecs_service" "main" {
  name                = local.name
  cluster             = module.ecs.cluster_id
  task_definition     = aws_ecs_task_definition.main.arn
  launch_type         = "FARGATE"
  scheduling_strategy = "REPLICA"

  desired_count = 1

  deployment_controller {
    type = "CODE_DEPLOY"
  }

  network_configuration {
    security_groups  = [aws_security_group.task.id]
    subnets          = module.vpc.private_subnets
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_alb_target_group.main.arn
    container_name   = "nginx"
    container_port   = "8080"
  }

  lifecycle {
    ignore_changes = [task_definition, desired_count, load_balancer]
  }
}