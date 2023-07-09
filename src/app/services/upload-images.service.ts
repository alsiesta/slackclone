import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
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

  onFileSelected(event: any, uid): Promise<string> {
    this.selectedFile = event.target.files[0];
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
    const fileName = uid + '_' + file.name;
    const storageRef = ref(storage, 'thread_images/'+ fileName);
    await uploadBytes(storageRef, file);
    this.downloadURL = await getDownloadURL(storageRef);
  }

}
