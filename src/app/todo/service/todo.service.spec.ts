import { TestBed } from '@angular/core/testing';

import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a todo in the waiting list', () => {
    service.addTodo('name', 'content');
    expect(service.todosByStatus().waiting.length).toBe(1);
    expect(service.todosByStatus().waiting[0].status).toBe('waiting');
  });

  it('should move a todo to another list when its status changes', () => {
    service.addTodo('name', 'content');
    const id = service.todos()[0].id;

    service.changeStatus(id, 'in progress');

    expect(service.todosByStatus().waiting.length).toBe(0);
    expect(service.todosByStatus()['in progress'][0].id).toBe(id);
  });

  it('should delete a todo', () => {
    service.addTodo('name', 'content');
    service.deleteTodo(service.todos()[0].id);
    expect(service.todos().length).toBe(0);
  });
});
