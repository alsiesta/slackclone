import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import {
  getDownloadURL,
  getMetadata,
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
    if (!this.selectedFile) {
      return null;
    }
    const storage = getStorage();
    const fileName = uid + '_' + this.selectedFile.name;
    const storageRef = ref(storage, 'thread_images/'+ fileName);
    await uploadBytes(storageRef, this.selectedFile);
    getMetadata(storageRef)
      .then((metadata) => {
        console.log(metadata);
      })
      .catch((error) => {
        console.log(error);
      });
    this.downloadURL = await getDownloadURL(storageRef);
    return this.downloadURL;
  }

}
