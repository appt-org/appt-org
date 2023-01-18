import { BaseGtmEvent } from 'shared/utils/analytics-utils';

declare global {
  interface Window {
    dataLayer: BaseGtmEvent[];
  }
}
