// Export all services for easy importing
export { default as authService } from './auth.service';
export { default as parcelService } from './parcel.service';
export { default as stationService } from './station.service';
export { default as paymentService } from './payment.service';
export { default as batchService } from './batch.service';
export { default as notificationService } from './notification.service';
export { default as adminService } from './admin.service';

// Now you can import like:
// import { authService, parcelService } from '@/services';