import { UserType } from '../../users/entities/user.entity';
import { FATHERLAND_FRONT_CODE } from '../../organizations/entities/organization.entity';
import { AuthenticatedUser } from '../decorators/current-user.decorator';

export function isFatherlandFrontOrAdmin(user: AuthenticatedUser): boolean {
  return (
    user.userType === UserType.ADMIN ||
    user.organizationCode === FATHERLAND_FRONT_CODE
  );
}
