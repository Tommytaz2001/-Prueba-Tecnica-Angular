import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { NotificationType } from '@core/interfaces/notification.interface';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationService],
    });
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('success', () => {
    it('should add a success notification', (done) => {
      const message = 'Success message';

      service.getNotifications().subscribe((notifications) => {
        if (notifications.length > 0) {
          expect(notifications[0].type).toBe(NotificationType.SUCCESS);
          expect(notifications[0].message).toBe(message);
          expect(notifications[0].dismissible).toBe(true);
          done();
        }
      });

      service.success(message);
    });
  });

  describe('error', () => {
    it('should add an error notification', (done) => {
      const message = 'Error message';

      service.getNotifications().subscribe((notifications) => {
        if (notifications.length > 0) {
          expect(notifications[0].type).toBe(NotificationType.ERROR);
          expect(notifications[0].message).toBe(message);
          done();
        }
      });

      service.error(message);
    });
  });

  describe('warning', () => {
    it('should add a warning notification', (done) => {
      const message = 'Warning message';

      service.getNotifications().subscribe((notifications) => {
        if (notifications.length > 0) {
          expect(notifications[0].type).toBe(NotificationType.WARNING);
          expect(notifications[0].message).toBe(message);
          done();
        }
      });

      service.warning(message);
    });
  });

  describe('info', () => {
    it('should add an info notification', (done) => {
      const message = 'Info message';

      service.getNotifications().subscribe((notifications) => {
        if (notifications.length > 0) {
          expect(notifications[0].type).toBe(NotificationType.INFO);
          expect(notifications[0].message).toBe(message);
          done();
        }
      });

      service.info(message);
    });
  });

  describe('dismiss', () => {
    it('should remove a notification by id', (done) => {
      let notificationId = '';

      service.getNotifications().subscribe((notifications) => {
        if (notifications.length === 1) {
          notificationId = notifications[0].id;
          service.dismiss(notificationId);
        } else if (notifications.length === 0 && notificationId) {
          expect(notifications.length).toBe(0);
          done();
        }
      });

      service.success('Test message');
    });
  });

  describe('dismissAll', () => {
    it('should remove all notifications', (done) => {
      let callCount = 0;

      service.getNotifications().subscribe((notifications) => {
        callCount++;
        if (callCount === 3) {
          expect(notifications.length).toBe(2);
          service.dismissAll();
        } else if (callCount === 4) {
          expect(notifications.length).toBe(0);
          done();
        }
      });

      service.success('Message 1');
      service.error('Message 2');
    });
  });

  describe('auto-dismiss', () => {
    it('should auto-dismiss notification after duration', (done) => {
      jest.useFakeTimers();
      let notificationAdded = false;

      service.getNotifications().subscribe((notifications) => {
        if (notifications.length === 1 && !notificationAdded) {
          notificationAdded = true;
          expect(notifications.length).toBe(1);
          jest.advanceTimersByTime(3000);
        } else if (notifications.length === 0 && notificationAdded) {
          expect(notifications.length).toBe(0);
          jest.useRealTimers();
          done();
        }
      });

      service.success('Auto dismiss message', 3000);
    });
  });
});
