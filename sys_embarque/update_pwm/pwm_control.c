#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <unistd.h>
#include <string.h>

#define PWM_PATH "/sys/class/pwm/pwmchip0/pwm0/"
#define PERIOD_PATH "period"
#define DUTY_CYCLE_PATH "duty_cycle"
#define ENABLE_PATH "enable"

int set_pwm(int period, int duty_cycle) {
    int fd;
    char buffer[64];

    // Set PWM period
    fd = open(PWM_PATH PERIOD_PATH, O_WRONLY);
    if (fd == -1) {
        perror("Failed to open PWM period");
        return -1;
       perror("Failed to open PWM period");
        return -1;
    }
    snprintf(buffer, sizeof(buffer), "%d", period);
    write(fd, buffer, strlen(buffer));
    close(fd);

    // Set PWM duty cycle
    fd = open(PWM_PATH DUTY_CYCLE_PATH, O_WRONLY);
    if (fd == -1) {
        perror("Failed to open PWM duty cycle");
        return -1;
    }
    snprintf(buffer, sizeof(buffer), "%d", duty_cycle);
    write(fd, buffer, strlen(buffer));
    close(fd);

    // Enable PWM
    fd = open(PWM_PATH ENABLE_PATH, O_WRONLY);
    if (fd == -1) {
  GNU nano 5.4                      pwm_control.c                               
        perror("Failed to enable PWM");
        return -1;
    }
    write(fd, "1", 1);
    close(fd);

    return 0;
}

int main(int argc, char *argv[]) {
    if (argc != 3) {
        fprintf(stderr, "Usage: %s <period> <duty_cycle>\n", argv[0]);
        return 1;
    }

    int period = atoi(argv[1]);
    int duty_cycle = atoi(argv[2]);

    if (set_pwm(period, duty_cycle) != 0) {
        fprintf(stderr, "Failed to configure PWM\n");
        return 1;
    }

    printf("PWM configured: Period = %d, Duty Cycle = %d\n", period, duty_cycle>
    return 0;
}





