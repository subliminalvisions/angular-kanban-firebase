import { Component } from '@angular/core';
import { Task } from './task/task';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogResult, TaskDialogComponent } from './task-dialog/task-dialog.component';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

const getObservable = (collection: AngularFirestoreCollection<Task>) => {
  const subject = new BehaviorSubject([]);
  collection.valueChanges({ idField: 'id' }).subscribe((val: Task[]) => {
    subject.next(val);
  });
  return subject;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'kanban-firebase-app';
  // todo: Task[] = [...];
  // todo: Task[] = [
  //   { title: 'buy milk', description: 'Go to store' },
  // ];
  // inProgress: Task[] = [];
  // done: Task[] = [];
  // todo = this.store.collection('todo').valueChanges({ idField: 'id' });
  // inProgress = this.store.collection('inProgress').valueChanges({ idField: 'id' });
  // done = this.store.collection('done').valueChanges({ idField: 'id' });
  todo = getObservable(this.store.collection('todo'));
  inProgress = getObservable(this.store.collection('inProgress'));
  done = getObservable(this.store.collection('done'));

  constructor(private dialog: MatDialog, private store: AngularFirestore) {}

  newTask(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task: {},
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: TaskDialogResult) => this.store.collection('todo').add(result.task));
  }

  // editTask(list: string, task: Task): void {}
  editTask(list: 'done' | 'todo' | 'inProgress', task: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task,
        enableDelete: true,
      },
    });
    dialogRef.afterClosed().subscribe((result: TaskDialogResult) => {
      if (result.delete) {
        this.store.collection(list).doc(task.id).delete();
      } else {
        this.store.collection(list).doc(task.id).update(task);
      }
    });
  }
// Let's look at the arguments of the editTask method:
// A list of type 'done' | 'todo' | 'inProgress' which is a string literal union type with values corresponding to the properties associated with the individual swimlanes
// The current task we want to edit
// In the method's body we first open an instance of the TaskDialogComponent. As its data we pass an object literal which specifies the task we want to edit and also enables the edit button in the form by setting the enableDelete property to true.

// When we get the result from the dialog we handle two scenarios:
// When the delete flag is set to true (i.e., when the user has pressed the delete button), we remove the task from the corresponding list
// Alternatively, we just replace the task on the given index with the task we got from the dialog result

  // drop(event: CdkDragDrop<Task[]>): void {
  //   if (event.previousContainer === event.container) {
  //     return;
  //   }
  //   transferArrayItem(
  //     event.previousContainer.data,
  //     event.container.data,
  //     event.previousIndex,
  //     event.currentIndex
  //   );
  // }

  drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      return;
    }
    const item = event.previousContainer.data[event.previousIndex];
    this.store.firestore.runTransaction(() => {
      const promise = Promise.all([
        this.store.collection(event.previousContainer.id).doc(item.id).delete(),
        this.store.collection(event.container.id).add(item),
      ]);
      return promise;
    });
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }
  

}
