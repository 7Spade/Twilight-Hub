/**
 * @fileoverview Forms 組件統一導出
 * 整合所有表單相關組件，提供清晰的 API
 */

// 統一的表單字段組件
export { 
  FormField, 
  FormInput, 
  FormTextarea, 
  FormSwitch,
  type FormFieldProps,
  type FormFieldType 
} from './form-field';

// 表單容器組件
export { FormCard } from './form-card';

// 向後兼容的導出（逐步棄用）
export { FormInput as FormInputLegacy } from './form-input';
export { FormTextarea as FormTextareaLegacy } from './form-textarea';
export { FormSwitch as FormSwitchLegacy } from './form-switch';
