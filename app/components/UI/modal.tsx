// css
import '@/sass/components/modal.scss';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  className: string;
  children: React.ReactNode;
};

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <>
      <div className={`mask ${isOpen ? 'isOpen' : ''}`} 
      onClick={onClose}>
      </div>
      <div className={`modal ${isOpen ? 'isOpen' : ''}`}>
        <div className="modalWrap">{children}</div>
      </div>
    </>
  );
};