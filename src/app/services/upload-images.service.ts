import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from 'firebase/storage';
import { UsersService } from './users.service';
import { HotToastService } from '@ngneat/hot-toast';


@Injectable({
  providedIn: 'root',
})
  
export class UploadImagesService {
  constructor(
    public firestoreService: FirestoreService,
    private usersService: UsersService,
    private toast: HotToastService,
  ) { }
  
  currentUserId$: any;
  selectedFile: File;
  downloadURL?: string;
  
  async ngOnInit() {
    this.currentUserId$ = this.usersService.getCurrentUserId();
  }

  /**
   * is called when the user selects a file.
   * @param file 
   * @param uid 
   * @returns string of the downloadURL
   */
  async onFileSelected(file, uid): Promise<string> {
    this.selectedFile = file;
    const downloadURL = await this.onUpload(uid);
    return downloadURL;
  }

  async onUpload(uid): Promise<string> {
    await this.uploadFile(uid, this.selectedFile);
    return this.downloadURL;
  }

  /**
   * is called when the user selects a file.
   * cleans the base64 image and uploads it to firebase storage.
   * returns the download url of the uploaded file.
   * @param uid 
   * @param file 
   * @returns 
   */
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

  /**
   * retrieves the download url of the uploaded file.
   * @param storageRef 
   * @returns string of the downloadURL
   */
  async setDownloadURL(storageRef) {
    return await getDownloadURL(storageRef)
      .then((url) => {
        this.downloadURL = url;
      })
      .catch((error) => {
        this.toast.error(error.message);
      });
  }
}
