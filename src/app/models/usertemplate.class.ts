
export class UserTemplate {
  password?: string;
  displayName?: string;
  photoURL?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  birthDate?: number;
  street?: string;
  zipCode?: number;
  city?: string;
  isOnline?: boolean;

  constructor(obj?: any) {
    this.password = obj ? obj.password : '';
    this.displayName = obj ? obj.displayName : '';
    this.photoURL = obj ? obj.photoURL : '';
    this.firstName = obj ? obj.firstName : '';
    this.lastName = obj ? obj.lastName : '';
    this.email = obj ? obj.email : '';
    this.birthDate = obj ? obj.birthDate : '';
    this.street = obj ? obj.street : '';
    this.zipCode = obj ? obj.zipCode : '';
    this.city = obj ? obj.city : '';
  }

  public toJSON?(): any {
    return {
      password: this.password,
      displayName: this.displayName,
      photoURL: this.photoURL,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      birthDate: this.birthDate,
      street: this.street,
      zipCode: this.zipCode,
      city: this.city,
    };
  }
}
