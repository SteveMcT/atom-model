import { BehaviorSubject } from 'rxjs';
import atoms from '../assets/atoms.json';

class AtomStore {
  public atomList = new BehaviorSubject(atoms);
}

const _atomStore = new AtomStore();
export default _atomStore;
