import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { AutocompleteComponent } from "./autocomplete.component";
import { CvService } from "../services/cv.service";
import { Cv } from "../model/cv";

describe("AutocompleteComponent (Signals)", () => {
  let component: AutocompleteComponent;
  let fixture: ComponentFixture<AutocompleteComponent>;
  let cvServiceSpy: jasmine.SpyObj<CvService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockCvs: Cv[] = [
    new Cv(1, "Aymen", "Sellaouti", "Teacher", "as.jpg", "1234", 40),
    new Cv(2, "Skander", "Sellaouti", "Enfant", "", "5678", 5),
  ];

  beforeEach(async () => {
    cvServiceSpy = jasmine.createSpyObj("CvService", [
      "selectByName",
      "selectCv",
    ]);
    routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

    cvServiceSpy.selectByName.and.returnValue(of(mockCvs));

    await TestBed.configureTestingModule({
      imports: [AutocompleteComponent],
      providers: [
        { provide: CvService, useValue: cvServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize with empty searchTerm and cvs signals", () => {
    expect(component.searchTerm()).toBe("");
    expect(component.cvs()).toEqual([]);
    expect(component.isLoading()).toBeFalse();
  });

  it("should debounce input and call selectByName on CvService", fakeAsync(() => {
    component.searchTerm.set("sellaouti");
    fixture.detectChanges();

    expect(cvServiceSpy.selectByName).not.toHaveBeenCalled();

    tick(300);
    fixture.detectChanges();

    expect(cvServiceSpy.selectByName).toHaveBeenCalledWith("sellaouti");
    expect(component.cvs()).toEqual(mockCvs);
    expect(component.isLoading()).toBeFalse();
  }));

  it("should not call selectByName if search term is empty or only whitespace", fakeAsync(() => {
    component.searchTerm.set("   ");
    fixture.detectChanges();

    tick(300);
    fixture.detectChanges();

    expect(cvServiceSpy.selectByName).not.toHaveBeenCalled();
    expect(component.cvs()).toEqual([]);
  }));

  it("should call cvService.selectCv and router.navigate on selectCv", () => {
    const selected = mockCvs[0];
    component.selectCv(selected);

    expect(cvServiceSpy.selectCv).toHaveBeenCalledWith(selected);
    expect(routerSpy.navigate).toHaveBeenCalledWith(["/cv", selected.id]);
  });

  it("should reset search signal when resetSearch is called", () => {
    component.searchTerm.set("test");
    expect(component.searchTerm()).toBe("test");

    component.resetSearch();
    expect(component.searchTerm()).toBe("");
  });
});
