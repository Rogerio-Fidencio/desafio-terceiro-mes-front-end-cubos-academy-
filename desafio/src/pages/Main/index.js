import { useEffect, useState } from 'react';
import Filters from '../../components/Filters';
import Header from '../../components/Header';
import ModalStorageTransactions from '../../components/ModalStorageTransactions';
import Resume from '../../components/Resume';
import TransactionsList from '../../components/TransactionsList';
import './styles.css';

function Main() {
  const [open, setOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [currentTransaction, setCurrentTransaction] = useState(false);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    handleLoadTransactions();
  }, [reload]);

  useEffect(() => {
    if (currentTransaction) {
      setOpen(true);
    }
  }, [currentTransaction]);

  useEffect(() => {
    if (!open) {
      handleLoadTransactions();
    }

    if (!open && currentTransaction) {
      setCurrentTransaction(false);
    }

    // eslint-disable-next-line
  }, [open]);

  function handleOrderTransactions(newTransactions) {
    setTransactions(newTransactions);
  }

  async function handleLoadTransactions() {
    const response = await fetch('http://localhost:3334/transactions', {
      method: 'GET'
    });

    const data = await response.json();
    setTransactions(data);
  }

  return (
    <div className="container-main">
      <Header />
      <main>
        <div>
          <Filters
            transactions={transactions}
            reload={reload}
            setReload={setReload}
            handleOrderTransactions={handleOrderTransactions}
          />
          <TransactionsList
            transactions={transactions}
            setCurrentTransaction={setCurrentTransaction}
            setReload={setReload}
            reload={reload}
            handleOrderTransactions={handleOrderTransactions}
          />
        </div>
        <div>
          <Resume
            transactions={transactions}
          />
          <button
            className="btn-insert-register"
            onClick={() => setOpen(true)}
          >
            Adicionar registro
          </button>
        </div>
      </main>

      <ModalStorageTransactions
        open={open}
        setOpen={setOpen}
        currentTransaction={currentTransaction}
      />

    </div>
  );
}

export default Main;
