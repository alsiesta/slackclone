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

  async onFileSelected(file, uid): Promise<string> {
    this.selectedFile = file;
    const downloadURL = await this.onUpload(uid);
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
    const fileName = uid + '_' + file.fileName;
    const storageRef = ref(storage, 'thread_images/' + fileName);
    const type = file.base64.split(';')[0].split(':')[1];
    const metadata = {
      contentType: type,
    };

    const cleanBase64Image = file.base64.split(',')[1];
    await uploadString(storageRef, cleanBase64Image, 'base64', metadata);
    await this.setDownloadURL(storageRef);
    return this.downloadURL;
  }

  async setDownloadURL(storageRef) {
    return await getDownloadURL(storageRef)
      .then((url) => {
        this.downloadURL = url;
      })
      .catch((error) => {
        console.log('DownloadURL error: ', error);
      });
  }
}
