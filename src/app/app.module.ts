import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './modules/material.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { HotToastModule } from '@ngneat/hot-toast';
import { AuthGuard } from './services/auth.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { MainComponent } from './components/main/main.component';
import { ThreadsComponent } from './components/threads/threads.component';
import { ChannelComponent } from './components/channel/channel.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ChannelDialogComponent } from './components/channel-dialog/channel-dialog.component';
import { CommentfieldComponent } from './components/commentfield/commentfield.component';
import { UsersService } from './services/users.service';
import { FirestoreService } from './services/firestore.service';
import { AuthService } from './services/auth.service';
import { UploadImagesService } from './services/upload-images.service';

import { provideStorage, getStorage } from '@angular/fire/storage';

import { ChatComponent } from './components/chat/chat.component';
import { DialogEditUserComponent } from './components/dialog-edit-user/dialog-edit-user.component';
import { DialogNewMessageComponent } from './components/dialog-new-message/dialog-new-message.component';
import { QuillModule } from 'ngx-quill';
import { DialogCreateNewChannelComponent } from './components/dialog-create-new-channel/dialog-create-new-channel.component';
import { ThreadsShortcutComponent } from './components/threads-shortcut/threads-shortcut.component';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { DialogCreateNewChatComponent } from './components/dialog-create-new-chat/dialog-create-new-chat.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { UsersShortcutComponent } from './components/users-shortcut/users-shortcut.component';
import { ImprintComponent } from './components/imprint/imprint.component';
import { DataProtectionComponent } from './components/data-protection/data-protection.component';
import { UniquePipe } from './pipes/unique.pipe';
import { GoogleAuthProvider } from "firebase/auth";
import { DialogAttachmentImageComponent } from './components/dialog-attachment-image/dialog-attachment-image.component';
import { DialogResetPasswordComponent } from './components/dialog-reset-password/dialog-reset-password.component';


@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    SignInComponent,
    HomeComponent,
    HeaderComponent,
    MainComponent,
    ThreadsComponent,
    ChannelComponent,
    SidebarComponent,
    ChannelDialogComponent,
    CommentfieldComponent,
    ChatComponent,
    DialogEditUserComponent,
    DialogNewMessageComponent,
    DialogCreateNewChannelComponent,
    ThreadsShortcutComponent,
    DateAgoPipe,
    DialogCreateNewChatComponent,
    UsersShortcutComponent,
    ImprintComponent,
    DataProtectionComponent,
    UniquePipe,
    DialogAttachmentImageComponent,
    DialogResetPasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideMessaging(() => getMessaging()),
    provideStorage(() => getStorage()),
    BrowserAnimationsModule,
    HotToastModule.forRoot({
      duration: 3000,
      position: 'top-center',
      autoClose: true,
    }),
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    QuillModule.forRoot(),
  ],
  providers: [AuthGuard, UsersService, FirestoreService, AuthService, GoogleAuthProvider,UploadImagesService],
  bootstrap: [AppComponent],
})
export class AppModule {}
