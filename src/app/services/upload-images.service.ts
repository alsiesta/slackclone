import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadString,
} from 'firebase/storage';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root',
})
  
export class UploadImagesService {
  constructor(
    public firestoreService: FirestoreService,
    private usersService: UsersService
  ) { }
  
  currentUserId$: any;
  selectedFile: File;
  downloadURL?: string;
  
  async ngOnInit() {
    this.currentUserId$ = this.usersService.getCurrentUserId();
  }

  onFileSelected(file, uid): Promise<string> {
    this.selectedFile = file;
    const downloadURL = this.onUpload(uid);
    return downloadURL;
  }

  async onUpload(uid): Promise<string> {
    await this.uploadFile(uid, this.selectedFile);
    return this.downloadURL;
  }

  async uploadFile(uid, file) {
    if (!file) {
      return null;
    }
    const storage = getStorage();
    const name = 'tollerName';
    const fileName = uid + '_' + name;
    const storageRef = ref(storage, 'thread_images/' + fileName);
    const type = file.split(';')[0].split(':')[1];
    console.log('Image type:', type);
    const metadata = {
      contentType: type,
    };
    const cleanBase64Image = file.split(',')[1];
    console.log('Image file:', cleanBase64Image);
    uploadString(storageRef, cleanBase64Image, 'base64', metadata).then((snapshot) => {
      console.log('Uploaded a base64 string!');
    })
    
    // await uploadBytes(storageRef, file); // method to upload file OR Blob data
    
    this.downloadURL = await getDownloadURL(storageRef);
  }

}
