import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CharacterDetailComponent } from './card-detail.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('CharacterDetailComponent', () => {
  let component: CharacterDetailComponent;
  let fixture: ComponentFixture<CharacterDetailComponent>;
  let httpMock: HttpTestingController;
  let mockActivatedRoute;

  beforeEach(waitForAsync(() => {

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue('1'), 
        },
      },
    };

    TestBed.configureTestingModule({
      imports: [CharacterDetailComponent, HttpClientTestingModule],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterDetailComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch character data on ngOnInit', () => {
    fixture.detectChanges();


    const req = httpMock.expectOne('https://rickandmortyapi.com/api/character/1');
    expect(req.request.method).toBe('GET');

 
    const mockCharacter = { id: 1, name: 'Rick Sanchez' };
    req.flush(mockCharacter);


    expect(component.character).toEqual(mockCharacter);
  });

  it('should call goBack and navigate back', () => {

    const spy = jest.spyOn(window.history, 'back');

    component.goBack();

    expect(spy).toHaveBeenCalled();
  });
});
