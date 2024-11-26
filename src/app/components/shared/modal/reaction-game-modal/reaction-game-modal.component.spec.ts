import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactionGameModalComponent } from './reaction-game-modal.component';
import { ModalBaseComponent } from '../modal-base/modal-base.component';

describe('ReactionGameModalComponent', () => {
  let component: ReactionGameModalComponent;
  let fixture: ComponentFixture<ReactionGameModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactionGameModalComponent, ModalBaseComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ReactionGameModalComponent);
    component = fixture.componentInstance;
    component.score = { player: 0, computer: 0 };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly determine the winner as player when player score is 10 or more', () => {
    component.score = { player: 10, computer: 5 };
    expect(component.getWinner()).toBe('player');
  });

  it('should correctly determine the winner as computer when player score is less than 10', () => {
    component.score = { player: 5, computer: 10 };
    expect(component.getWinner()).toBe('computer');
  });

  it('should emit the restart event when restart action is triggered', () => {
    spyOn(component.restart, 'emit');
    component.onButtonClick('restart');
    expect(component.restart.emit).toHaveBeenCalled();
  });

  it('should emit the exit event when exit action is triggered', () => {
    spyOn(component.exit, 'emit');
    component.onButtonClick('exit');
    expect(component.exit.emit).toHaveBeenCalled();
  });

  it('should return the correct title for player winning', () => {
    component.score = { player: 10, computer: 5 };
    expect(component.getTitle()).toBe('🎉 Congratulations! You Won! 🎉');
  });

  it('should return the correct title for computer winning', () => {
    component.score = { player: 5, computer: 10 };
    expect(component.getTitle()).toBe('💻 The Computer Won! Better luck next time. 💻');
  });

  it('should call exit emit when onClose is called', () => {
    spyOn(component.exit, 'emit');
    component.onClose();
    expect(component.exit.emit).toHaveBeenCalled();
  });
});
