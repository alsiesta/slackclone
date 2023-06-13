import { Component, OnInit} from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-threads',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.scss']
})
export class ThreadsComponent implements OnInit {

  constructor(public firestoreService: FirestoreService) {
    
  }
  
  ngOnInit(): void {
    
  }
}
