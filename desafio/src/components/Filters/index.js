import './styles.css';
import filterIcon from '../../assets/filter-icon.svg'
import { useEffect, useState } from 'react/cjs/react.development';
import Chip from '../Chip';
import defaultWeeksDays from './defaulWeeksDay';
import { getOnlySelectedWeekDays, mergeNewAndOldCategs } from './utils';

function Filters({ transactions, handleOrderTransactions, reload, setReload }) {
  const [open, setOpen] = useState(false);
  const [weekDays, setWeekDays] = useState(defaultWeeksDays);
  const [categories, setCategories] = useState([]);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(0);
  const [transactionsInFilter, setTransactionsInFilter] = useState([]);

  useEffect(() => {
    function populateCategoriesInFilters() {
      const allCategories = mergeNewAndOldCategs(transactionsInFilter, categories);

      setCategories(allCategories);
    }

    populateCategoriesInFilters();

    // eslint-disable-next-line
  }, [transactionsInFilter]);

  useEffect(() => {
    loadTransactionsInFilter();
  }, [transactions]);

  async function loadTransactionsInFilter() {
    const response = await fetch('http://localhost:3334/transactions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    setTransactionsInFilter(data);
  }

  function handleSelectedWeekDayFilter(weekDay) {
    const localWeeksDay = [...weekDays];

    const day = localWeeksDay.find((day) => day.name === weekDay);
    day.selected = !day.selected;

    setWeekDays(localWeeksDay);
  }

  function handleSelectedCategFilter(categ) {
    const localCategs = [...categories];

    const category = localCategs.find((category) => category.name === categ);
    category.selected = !category.selected;

    setCategories(localCategs);
  }

  function handleClearFilters() {
    const localWeeksDay = [...weekDays];

    for (const day of localWeeksDay) {
      day.selected = false;
    }
    setWeekDays(defaultWeeksDays);

    const localCategs = [...categories];

    for (const categ of localCategs) {
      categ.selected = false;
    }
    setCategories(localCategs);

    setMaxValue(0);
    setMinValue(0);

    setReload(!reload);
  }

  function applyFiltersOnlyByValueMinAndMax(localTransactions) {
    const transactionsFilteredByValue = [];

    for (const transact of localTransactions) {

      if (minValue && Number(transact.value) < minValue) {
        continue;
      }

      if (maxValue && Number(transact.value) > maxValue) {
        continue;
      }

      if (minValue && minValue <= Number(transact.value)) {
        transactionsFilteredByValue.push(transact);
      }

      if (maxValue && maxValue >= Number(transact.value)) {
        transactionsFilteredByValue.push(transact);
      }
    }

    const idTransactions = [];
    const transactionsRemovedDupplicateds = [];

    for (const transact of transactionsFilteredByValue) {
      if (idTransactions.indexOf(transact.id) === -1) {
        idTransactions.push(transact.id);
        transactionsRemovedDupplicateds.push(transact);
      }
    }

    handleOrderTransactions(transactionsRemovedDupplicateds);
  }

  function applyAllFilters(localTransactions, selectedDays, selectedCategs) {
    const filteredTransactions = [];

    for (const transact of localTransactions) {
      if (minValue && Number(transact.value) < minValue) {
        continue;
      }

      if (maxValue && Number(transact.value) > maxValue) {
        continue;
      }

      if (selectedDays.length > 0 && selectedCategs.length > 0) {
        if (selectedDays.includes(transact.week_day.toLowerCase())
          && selectedCategs.includes(transact.category.toLowerCase())) {
          filteredTransactions.push(transact);
        }
        continue;
      }

      if (selectedDays.length > 0 && selectedDays.includes(transact.week_day.toLowerCase())) {
        filteredTransactions.push(transact);
        continue;
      }

      if (selectedCategs.length > 0 && selectedCategs.includes(transact.category.toLowerCase())) {
        filteredTransactions.push(transact);
        continue;
      }
    }

    const transactionsIdAux = [];
    const transactionsWithoutDupplicateds = [];

    for (const transact of filteredTransactions) {
      if (transactionsIdAux.indexOf(transact.id) === -1) {
        transactionsIdAux.push(transact.id);
        transactionsWithoutDupplicateds.push(transact);
      }
    }

    handleOrderTransactions(transactionsWithoutDupplicateds);
  }

  function handleApplyFilters() {
    const selectedDays = getOnlySelectedWeekDays(weekDays);
    const selectedCategs = getOnlySelectedWeekDays(categories);

    if (!selectedDays.length && !selectedCategs.length && !minValue && !maxValue) {
      setReload(!reload);
      return;
    }

    const localTransactions = [...transactionsInFilter];

    if (selectedDays.length === 0 && selectedCategs.length === 0) {
      applyFiltersOnlyByValueMinAndMax(localTransactions);
      return;
    }

    applyAllFilters(localTransactions, selectedDays, selectedCategs);
  }

  return (
    <div className="container-filters">
      <button
        className="btn-filter"
        onClick={() => setOpen(!open)}
      >
        <img src={filterIcon} alt="filters" />
        <strong>Filtrar</strong>
      </button>
      {open &&
        <div className="content-filters">
          <div className="items-filter">
            <strong>Dia da semana</strong>
            <div className="container-chips">
              {weekDays.map((day) => (
                <Chip
                  key={day.name}
                  title={day.name}
                  selected={day.selected}
                  handleSelectChip={handleSelectedWeekDayFilter}
                />
              ))}
            </div>
          </div>
          <div className="separator"></div>
          <div className="items-filter">
            <strong>Categoria</strong>
            <div className="container-chips">
              {categories.map((categ) => (
                <Chip
                  key={categ.name}
                  title={categ.name}
                  selected={categ.selected}
                  handleSelectChip={handleSelectedCategFilter}
                />
              ))}
            </div>
          </div>
          <div className="separator"></div>
          <div className="items-filter">
            <strong>Valor</strong>
            <div className="container-input-filter">
              <label>Min.</label>
              <input
                type="number"
                value={minValue}
                onChange={(e) => setMinValue(e.target.valueAsNumber)}
              />
            </div>
            <div className="container-input-filter">
              <label>Max.</label>
              <input
                type="number"
                value={maxValue}
                onChange={(e) => setMaxValue(e.target.value)} />
            </div>
          </div>
          <div className="container-action-buttons">
            <button
              className="btn-clear-filters"
              onClick={() => handleClearFilters()}
            >
              Limpar filtros
            </button>
            <button
              className="btn-apply-filters"
              onClick={() => handleApplyFilters()}
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      }
    </div>
  );
}

export default Filters;