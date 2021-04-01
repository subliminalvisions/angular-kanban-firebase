import { Component } from '@angular/core';
import { Task } from './task/task';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import { TaskDialogResult } from './task-dialog/task-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'kanban-firebase-app';
  todo: Task[] = [
    { title: 'buy milk', description: 'Go to store' },
    { title: 'buy bread', description: 'also at the store' } 
  ];
  // todo: Task[] = [...];
  inProgress: Task[] = [];
  done: Task[] = [];


  constructor(private dialog: MatDialog) {}

  newTask(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task: {},
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: TaskDialogResult) => this.todo.push(result.task));
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
      const dataList = this[list];
      const taskIndex = dataList.indexOf(task);
      if (result.delete) {
        dataList.splice(taskIndex, 1);
      } else {
        dataList[taskIndex] = task;
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

  drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      return;
    }
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }

}
