import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoComponent } from './todo.component';

describe('TodoComponent', () => {
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TodoComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(TodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a todo then move it and delete it from the page', async () => {
    fixture.autoDetectChanges();
    const page: HTMLElement = fixture.nativeElement;
    const [nameInput, contentInput] = Array.from(page.querySelectorAll('input'));
    nameInput.value = 'name';
    nameInput.dispatchEvent(new Event('input'));
    contentInput.value = 'content';
    contentInput.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    page.querySelector<HTMLButtonElement>('button[type=submit]')!.click();
    await fixture.whenStable();

    expect(page.querySelector('.waiting .card')?.textContent).toContain('name');

    const toInProgress = Array.from(page.querySelectorAll<HTMLButtonElement>('.waiting .card button'))
      .find((button) => button.textContent?.trim() === 'in progress')!;
    toInProgress.click();
    await fixture.whenStable();

    expect(page.querySelector('.waiting .card')).toBeNull();
    expect(page.querySelector('.in-progress .card')?.textContent).toContain('name');

    page.querySelector<HTMLElement>('.in-progress .fa-trash')!.click();
    await fixture.whenStable();

    expect(page.querySelectorAll('.card').length).toBe(0);
  });
});
