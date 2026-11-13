import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { AutocompleteComponent } from "./autocomplete.component";
import { CvService } from "../services/cv.service";
import { DefaultImagePipe } from "../pipes/default-image.pipe";
import { Cv } from "../model/cv";

describe("AutocompleteComponent", () => {
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
      declarations: [AutocompleteComponent, DefaultImagePipe],
      imports: [ReactiveFormsModule],
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

  it("should initialize with an empty search control", () => {
    expect(component.search.value).toBe("");
  });

  it("should debounce input and call selectByName on CvService", fakeAsync(() => {
    let result: Cv[] | undefined;
    component.cvs$.subscribe((cvs) => (result = cvs));

    component.search.setValue("sellaouti");
    expect(cvServiceSpy.selectByName).not.toHaveBeenCalled();

    tick(300);

    expect(cvServiceSpy.selectByName).toHaveBeenCalledWith("sellaouti");
    expect(result).toEqual(mockCvs);
  }));

  it("should not call selectByName if search term is empty or only whitespace", fakeAsync(() => {
    let result: Cv[] | undefined;
    component.cvs$.subscribe((cvs) => (result = cvs));

    component.search.setValue("   ");
    tick(300);

    expect(cvServiceSpy.selectByName).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  }));

  it("should call cvService.selectCv and router.navigate on selectCv", () => {
    const selected = mockCvs[0];
    component.selectCv(selected);

    expect(cvServiceSpy.selectCv).toHaveBeenCalledWith(selected);
    expect(routerSpy.navigate).toHaveBeenCalledWith(["/cv", selected.id]);
  });

  it("should reset search control when resetSearch is called", () => {
    component.search.setValue("test");
    expect(component.search.value).toBe("test");

    component.resetSearch();
    expect(component.search.value).toBe("");
  });
});
