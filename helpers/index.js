function parseArchiveDate(rawArchive) {
  const result = rawArchive.map(({ month, year }) => {
    switch (month) {
      case 1:
        return { month, year, textMonth: 'Січень' };
      case 2:
        return { month, year, textMonth: 'Лютий' };
      case 3:
        return { month, year, textMonth: 'Березень' };
      case 4:
        return { month, year, textMonth: 'Квітень' };
      case 5:
        return { month, year, textMonth: 'Травень' };
      case 6:
        return { month, year, textMonth: 'Червень' };
      case 7:
        return { month, year, textMonth: 'Липень' };
      case 8:
        return { month, year, textMonth: 'Серпень' };
      case 9:
        return { month, year, textMonth: 'Вересень' };
      case 10:
        return { month, year, textMonth: 'Жовтень' };
      case 11:
        return { month, year, textMonth: 'Листопад' };
      case 12:
        return { month, year, textMonth: 'Грудень' };
    }
  });
  return result;
}

module.exports = {
  parseArchiveDate,
};
