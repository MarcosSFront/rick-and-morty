import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CharacterListComponent } from './card.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('CharacterListComponent (standalone)', () => {
  let component: CharacterListComponent;
  let httpClientSpy: jest.Mocked<HttpClient>;
  let routerSpy: jest.Mocked<Router>;

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn()
    } as any;

    routerSpy = {
      navigate: jest.fn()
    } as any;

    // Directly instantiate the component and inject spies for standalone usage
    component = new CharacterListComponent();
    (component as any).http = httpClientSpy;
    (component as any).router = routerSpy;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load characters on init', fakeAsync(() => {
    const mockResponse = {
      results: [
        {
          id: 1,
          name: 'Rick',
          status: 'Alive',
          species: 'Human',
          gender: 'Male',
          location: { name: 'Earth' },
          image: 'img.jpg'
        }
      ]
    };
    httpClientSpy.get.mockReturnValue(of(mockResponse));
    component['currentPage'].set(1);
    component['characters'].set([]);
    component['hasMoreData'].set(true);
    component['isLoading'].set(false);

    component['loadCharacters']();
    tick();

    expect(component.characters().length).toBe(1);
    expect(component.isLoading()).toBe(false);
    expect(component.hasMoreData()).toBe(true);
  }));

  it('should handle empty results and set hasMoreData to false', fakeAsync(() => {
    httpClientSpy.get.mockReturnValue(of({ results: [] }));
    component['currentPage'].set(1);
    component['characters'].set([]);
    component['hasMoreData'].set(true);
    component['isLoading'].set(false);

    component['loadCharacters']();
    tick();

    expect(component.characters().length).toBe(0);
    expect(component.hasMoreData()).toBe(false);
    expect(component.isLoading()).toBe(false);
  }));

  it('should handle API error and set hasMoreData to false', fakeAsync(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    httpClientSpy.get.mockReturnValue(throwError(() => new Error('API Error')));
    component['hasMoreData'].set(true);
    component['isLoading'].set(false);

    component['loadCharacters']();
    tick();

    expect(component.hasMoreData()).toBe(false);
    expect(component.isLoading()).toBe(false);
    expect(console.error).toHaveBeenCalled();
    (console.error as jest.Mock).mockRestore();
  }));

  it('should update selectedGenders and reload on onGenderChange', () => {
    const loadCharactersSpy = jest.spyOn(component as any, 'loadCharacters');
    component.selectedGenders.set([]);
    component.onGenderChange('Male', true);
    expect(component.selectedGenders()).toContain('Male');
    expect(loadCharactersSpy).toHaveBeenCalled();

    component.onGenderChange('Male', false);
    expect(component.selectedGenders()).not.toContain('Male');
  });

  it('should update searchQuery and reload on onSearchChange', () => {
    const loadCharactersSpy = jest.spyOn(component as any, 'loadCharacters');
    component.onSearchChange('Morty');
    expect(component.searchQuery()).toBe('Morty');
    expect(loadCharactersSpy).toHaveBeenCalled();
  });

  it('should update selectedFilter and reload on onFilterChange', () => {
    const loadCharactersSpy = jest.spyOn(component as any, 'loadCharacters');
    component.onFilterChange('Alive');
    expect(component.selectedFilter()).toBe('Alive');
    expect(loadCharactersSpy).toHaveBeenCalled();
  });

  it('should navigate to character details on viewDetails', () => {
    component.viewDetails(42);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/character', 42]);
  });

  it('should not load characters if already loading or no more data', () => {
    const loadCharactersSpy = jest.spyOn(component as any, 'loadCharacters').mockImplementation(() => {});
    component.isLoading.set(true);
    component.hasMoreData.set(true);
    component['loadCharacters']();
    expect(httpClientSpy.get).not.toHaveBeenCalled();

    component.isLoading.set(false);
    component.hasMoreData.set(false);
    component['loadCharacters']();
    expect(httpClientSpy.get).not.toHaveBeenCalled();
    loadCharactersSpy.mockRestore();
  });
});
