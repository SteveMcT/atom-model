import { BehaviorSubject } from 'rxjs';
import atoms from '../assets/atoms.json';

class AtomStore {
  public atomList = new BehaviorSubject(atoms);
  public enableRotate = new BehaviorSubject(false);
}

const _atomStore = new AtomStore();
export default _atomStore;
