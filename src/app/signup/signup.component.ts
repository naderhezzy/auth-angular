import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpService } from "../services/http/http.service";
import { LocalService } from "../services/local/local.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  user: FormGroup;

  constructor(
    private router: Router,
    private http: HttpService,
    private local: LocalService
  ) {}

  ngOnInit(): void {
    this.user = new FormGroup({
      username: new FormControl(null),
      email: new FormControl(null),
      password: new FormControl(null),
      confirmPassword: new FormControl(null),
    });
  }

  onSubmit() {
    if (
      this.user.value.username === "" ||
      this.user.value.username === null ||
      this.user.value.email === "" ||
      this.user.value.email === null ||
      this.user.value.password === "" ||
      this.user.value.password === null ||
      this.user.value.confirmPassword === "" ||
      this.user.value.confirmPassword === null
    ) {
      return this.local.swal(
        "warning",
        "Empty!!",
        "Please fill the inputs!!",
        3000,
        false
      );
    } else if (this.user.value.password !== this.user.value.confirmPassword) {
      this.local.swal(
        "warning",
        "Not Match!!",
        "Password and Confirm Password should be the same.",
        3000,
        false
      );
    } else {
      var uName = this.local.userNameValidator(this.user.value.username);
      var email = this.local.emailValidator(this.user.value.email);
      var pass = this.local.passwordValidator(this.user.value.password);
      if (uName === true) {
        if (email === true) {
          if (pass === true) {
            return this.SignUp();
          } else {
            return this.local.swal("warning", "Not Match!!", pass, 3000, false);
          }
        } else {
          return this.local.swal("warning", "Not Match!!", email, 3000, false);
        }
      } else {
        return this.local.swal("warning", "Not Match!!", uName, 3000, false);
      }
    }
  }

  SignUp() {
    this.user.value.username = this.user.value.username.toLowerCase();
    this.user.value.email = this.user.value.email.toLowerCase();

    this.http.SignUp(this.user.value).subscribe((data) => {
      if (!data["token"]) {
        return this.local.swal("error", "Oops!!", data["msg"], 3000, false);
      } else {
        this.local.setToken(data["token"]);
        this.router.navigate([""]);
      }
    });
  }
}
