import { registry } from './conversion-registry';
import {
  thaiToEnglishConversion,
  englishToThaiConversion,
  base64EncodeConversion,
  base64DecodeConversion,
  md5HashConversion,
  sha256HashConversion,
  bcryptHashConversion,
  jwtDecodeConversion,
  jwtEncodeConversion,
} from './conversions';

registry.register(thaiToEnglishConversion);
registry.register(englishToThaiConversion);
registry.register(base64EncodeConversion);
registry.register(base64DecodeConversion);
registry.register(md5HashConversion);
registry.register(sha256HashConversion);
registry.register(bcryptHashConversion);
registry.register(jwtDecodeConversion);
registry.register(jwtEncodeConversion);

export { registry };
