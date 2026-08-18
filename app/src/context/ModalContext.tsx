import { createContext, useContext, useState, type ReactNode } from 'react'
import OrderModal from '../components/OrderModal'

interface ModalContextType {
  openOrderModal: (service?: string) => void
  closeOrderModal: () => void
}

const ModalContext = createContext<ModalContextType>({
  openOrderModal: () => {},
  closeOrderModal: () => {},
})

export const useOrderModal = () => useContext(ModalContext)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<string>('Full Cycle')

  const openOrderModal = (service?: string) => {
    if (service) setSelectedService(service)
    setIsOpen(true)
  }

  const closeOrderModal = () => {
    setIsOpen(false)
  }

  return (
    <ModalContext.Provider value={{ openOrderModal, closeOrderModal }}>
      {children}
      <OrderModal
        isOpen={isOpen}
        onClose={closeOrderModal}
        initialService={selectedService}
      />
    </ModalContext.Provider>
  )
}
