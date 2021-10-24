import './styles.css';
import TableHeader from './TableHeader';
import editIcon from '../../assets/edit-icon.svg';
import deleteIcon from '../../assets/delete-icon.svg';
import {
  formatToMoney,
  formatToDate,
  capitalizeWord
} from '../../utils/formatters';
import ConfirmChoose from '../ConfirmChoose';
import { useState } from 'react/cjs/react.development';

function TransactionsList({
  transactions,
  setCurrentTransaction,
  reload,
  setReload,
  handleOrderTransactions
}) {
  const [idItemDelete, setIdItemDelete] = useState(null);

  async function handleDeleteItem() {
    await fetch(`http://localhost:3334/transactions/${idItemDelete}`, {
      method: 'DELETE'
    });

    setIdItemDelete(null);
    setReload(!reload);
  }

  return (
    <div className="table">
      <TableHeader
        transactions={transactions}
        handleOrderTransactions={handleOrderTransactions}
      />
      <div className="table-body">
        {transactions.map((item) => (
          <div className="table-line" key={item.id}>
            <div className="line-items">
              {formatToDate(item.date)}
            </div>
            <div className="line-items">
              {capitalizeWord(item.week_day)}
            </div>
            <div className="line-items">{item.description}</div>
            <div className="line-items">{item.category}</div>
            <div
              className="line-items value-item"
              style={{
                color: item.type === 'credit'
                  ? '#7B61FF'
                  : '#FA8C10'
              }}
            >
              {formatToMoney(item.value)}
            </div>
            <div className="line-items">
              <img
                src={editIcon}
                alt="edit icon"
                className="action-button"
                onClick={() => setCurrentTransaction(item)}
              />
              <img
                src={deleteIcon}
                alt="delete icon"
                className="action-button"
                onClick={() => setIdItemDelete(item.id)}
              />
              <ConfirmChoose
                show={item.id === idItemDelete}
                setClose={() => setIdItemDelete(null)}
                message='Apagar item?'
                handleConfirm={() => handleDeleteItem()}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransactionsList;