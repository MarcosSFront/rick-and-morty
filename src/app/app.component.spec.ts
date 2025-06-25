import 'reflect-metadata';
import { TestBed } from '@angular/core/testing';
import { RouterOutlet } from '@angular/router';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'rick-and-morty' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('rick-and-morty');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, rick-and-morty');
  });

  it('should have standalone set to true in the component decorator', () => {
    const annotations = Reflect.getMetadata('annotations', AppComponent) || [];
    const componentMetadata = annotations.find((a: any) => a.selector === 'app-root');
    expect(componentMetadata.standalone).toBeTrue();
  });

  it('should import RouterOutlet in the component decorator', () => {
    const annotations = Reflect.getMetadata('annotations', AppComponent) || [];
    const componentMetadata = annotations.find((a: any) => a.selector === 'app-root');
    expect(componentMetadata.imports).toContain(RouterOutlet);
  });
});
