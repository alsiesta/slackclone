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
import { ChatComponent } from './components/chat/chat.component';
import { DialogEditUserComponent } from './components/dialog-edit-user/dialog-edit-user.component';
import { DialogNewMessageComponent } from './components/dialog-new-message/dialog-new-message.component';
import { QuillModule } from 'ngx-quill';
import { DialogCreateNewChannelComponent } from './components/dialog-create-new-channel/dialog-create-new-channel.component';
import { ThreadsShortcutComponent } from './components/threads-shortcut/threads-shortcut.component';
import { DateAgoPipe } from './pipes/date-ago.pipe';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideMessaging(() => getMessaging()),
    BrowserAnimationsModule,
    HotToastModule.forRoot({
      duration: 3000,
      position: 'top-center',
      autoClose: true,
    }),
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot()
  ],
  providers: [AuthGuard, UsersService, FirestoreService, AuthService],
  bootstrap: [AppComponent],
})
export class AppModule { }
