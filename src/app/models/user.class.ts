export class User {
  uid: string;
  password?: string;
    displayName?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    birthDate?: number;
    street?: string;
    zipCode?: number;
    city?: string;
  
    constructor(obj?: any) {
      this.uid = obj ? obj.uid : '';
      this.password = obj ? obj.password : '';
      this.displayName = obj ? obj.displayName : '';
      this.firstName = obj ? obj.firstName : '';
      this.lastName = obj ? obj.lastName : '';
      this.email = obj ? obj.email : '';
      this.birthDate = obj ? obj.birthDate : '';
      this.street = obj ? obj.street : '';
      this.zipCode = obj ? obj.zipCode : '';
      this.city = obj ? obj.city : '';
    }
  
    public toJSON() {
      return {
        uid: this.uid,
        password: this.password,
        displayName: this.displayName,
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
  