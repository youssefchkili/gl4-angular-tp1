import { Injectable, computed, inject, signal } from '@angular/core';
import { Todo, TodoStatus } from '../model/todo';
import { LoggerService } from '../../services/logger.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private loggerService = inject(LoggerService);

  private nextId = 1;

  /**
   * La source de vérité : seul le service peut la modifier
   */
  private todosSignal = signal<Todo[]>([]);

  /**
   * La liste des todos en lecture seule pour les consommateurs
   */
  readonly todos = this.todosSignal.asReadonly();

  /**
   * Les todos regroupés par statut, recalculés à chaque modification de la liste.
   * Changer le statut d'un todo le fait donc automatiquement changer de liste.
   */
  readonly todosByStatus = computed(() => {
    const groups: Record<TodoStatus, Todo[]> = {
      waiting: [],
      'in progress': [],
      done: [],
    };
    for (const todo of this.todosSignal()) {
      groups[todo.status].push(todo);
    }
    return groups;
  });

  /**
   * Elle permet d'ajouter un todo, il commence toujours en attente
   *
   * @param name: string
   * @param content: string
   */
  addTodo(name: string, content: string): void {
    const todo: Todo = { id: this.nextId++, name, content, status: 'waiting' };
    this.todosSignal.update((todos) => [...todos, todo]);
  }

  /**
   * Change le statut du todo ayant cet id
   *
   * @param id: number
   * @param status: TodoStatus
   */
  changeStatus(id: number, status: TodoStatus): void {
    this.todosSignal.update((todos) =>
      todos.map((todo) => (todo.id === id ? { ...todo, status } : todo))
    );
  }

  /**
   * Delete le todo ayant cet id
   *
   * @param id: number
   */
  deleteTodo(id: number): void {
    this.todosSignal.update((todos) => todos.filter((todo) => todo.id !== id));
  }

  /**
   * Logger la liste des todos
   */
  logTodos() {
    this.loggerService.logger(this.todosSignal());
  }
}
