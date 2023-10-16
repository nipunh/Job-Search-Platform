import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should set loggedUser and Authority in ngOnInit', () => {
    const userData = { username: 'testuser', role: 'user' };
    localStorage.setItem('user', JSON.stringify(userData));

    component.ngOnInit();

    expect(component.loggedUser).toEqual(userData);
    expect(component.Authority).toBeDefined();
  });

  // it('should clear local storage and navigate to home on logout', () => {
  //   spyOn(localStorage, 'clear');
  //   spyOn(component._router, 'navigateByUrl');
  //   spyOn(window.location, 'reload');

  //   component.logout();

  //   expect(localStorage.clear).toHaveBeenCalled();
  //   expect(component._router.navigateByUrl).toHaveBeenCalledWith('/home');
  //   // expect(window.location.reload).toHaveBeenCalled();
  // });
});
