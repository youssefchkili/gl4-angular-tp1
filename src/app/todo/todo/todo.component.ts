import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { TodoStatus } from '../model/todo';
import { TodoService } from '../service/todo.service';
import { FormsModule } from '@angular/forms';

interface TodoColumn {
  status: TodoStatus;
  title: string;
  cssClass: string;
}

@Component({
    selector: 'app-todo',
    templateUrl: './todo.component.html',
    styleUrls: ['./todo.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule]
})
export class TodoComponent {
  private todoService = inject(TodoService);

  readonly columns: TodoColumn[] = [
    { status: 'waiting', title: 'Waiting', cssClass: 'waiting' },
    { status: 'in progress', title: 'In Progress Todos', cssClass: 'in-progress' },
    { status: 'done', title: 'Done Todos', cssClass: 'done' },
  ];

  todosByStatus = this.todoService.todosByStatus;

  name = signal('');
  content = signal('');
  canAdd = computed(() => !!this.name().trim() && !!this.content().trim());

  addTodo() {
    this.todoService.addTodo(this.name().trim(), this.content().trim());
    this.name.set('');
    this.content.set('');
  }

  changeStatus(id: number, status: TodoStatus) {
    this.todoService.changeStatus(id, status);
  }

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id);
  }
}
