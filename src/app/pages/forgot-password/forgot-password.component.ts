import { Component } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Email } from 'src/app/model/email-dto';
import { UpdatePasswordDto } from 'src/app/model/update-password-dto';
import { SupervisorService } from 'src/app/service/admin/supervisor.service';
import { EmailService } from 'src/app/service/email.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  passwordValidate: boolean = false;
  showDialog: boolean = false;

  constructor(
    private supervisorService: SupervisorService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'];
    });
  }

  updatePassword() {
    const updatePasswordDto: UpdatePasswordDto = {
      email: this.email,
      password: this.password,
    };
    this.passwordValidate = true;
    console.log(this.passwordValidate);
    this.showDialog = true;
    this.supervisorService.updatePassword(updatePasswordDto).subscribe();
  }

  validatePassword() {
    if (this.password !== this.confirmPassword) {
      this.showDialog = true;
      return;
    }
    this.updatePassword();
  }

  closeDialog() {
    this.showDialog = false;
    this.passwordValidate = false;
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }
}
