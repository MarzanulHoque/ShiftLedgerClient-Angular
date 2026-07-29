import { HttpContextToken } from '@angular/common/http';

export const RETRIED_AFTER_REFRESH = new HttpContextToken<boolean>(() => false);
