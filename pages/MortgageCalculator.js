import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

const MortgageCalculator = ({ price }) => {
  // Инициализируем поля калькулятора
  const [propertyPrice, setPropertyPrice] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [totalPayment, setTotalPayment] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);

  // При загрузке компонента подставляем данные из объявления
  useEffect(() => {
    if (price) {
      setPropertyPrice(price.toString());
      setDownPayment(Math.round(price * 0.3).toString()); // 30% от цены
      setLoanTerm('20'); // 20 лет
      setInterestRate('3'); // 3%
    }
  }, [price]);

  // Функция форматирования чисел с пробелами
  const formatNumber = (value) => {
    const onlyNumbers = value.toString().replace(/\s+/g, '');
    return onlyNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  // Функция расчёта ипотеки
  const calculateMortgage = () => {
    const priceVal = parseFloat(propertyPrice.replace(/\s+/g, '')) || 0;
    const downVal = parseFloat(downPayment.replace(/\s+/g, '')) || 0;
    const termVal = parseFloat(loanTerm) || 0;
    const rateVal = parseFloat(interestRate) || 0;

    // Если первоначальный взнос больше или равен стоимости, устанавливаем сумму кредита в 0
    if (downVal >= priceVal) {
      setMonthlyPayment(0);
      setTotalPayment(0);
      setTotalInterest(0);
      return;
    }

    const loanAmount = priceVal - downVal;
    const monthlyRate = rateVal / 100 / 12;
    const numberOfPayments = termVal * 12;

    const monthly =
      loanAmount *
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const total = monthly * numberOfPayments;
    const interest = total - loanAmount;

    setMonthlyPayment(isNaN(monthly) ? 0 : Math.round(monthly));
    setTotalPayment(isNaN(total) ? 0 : Math.round(total));
    setTotalInterest(isNaN(interest) ? 0 : Math.round(interest));
  };


  // Автоматически пересчитываем результаты при изменении любого поля
  useEffect(() => {
    calculateMortgage();
  }, [propertyPrice, downPayment, loanTerm, interestRate]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Ипотечный калькулятор</Text>

        {/* Поле для стоимости недвижимости */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Стоимость недвижимости (₽):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={propertyPrice}
            onChangeText={setPropertyPrice}
          />
        </View>

        {/* Поле для первоначального взноса */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Первоначальный взнос (₽):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={downPayment}
            onChangeText={setDownPayment}
          />
        </View>

        {/* Поле для срока кредита */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Срок кредита (лет):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={loanTerm}
            onChangeText={setLoanTerm}
          />
        </View>

        {/* Поле для процентной ставки */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Процентная ставка (%):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={interestRate}
            onChangeText={setInterestRate}
          />
        </View>

        {/* Вывод результатов */}
        {monthlyPayment !== null && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Ежемесячный платёж:</Text>
            <Text style={styles.resultText}>{formatNumber(monthlyPayment)} ₽</Text>
            <Text style={styles.resultTitle}>Общая сумма выплат:</Text>
            <Text style={styles.resultText}>{formatNumber(totalPayment)} ₽</Text>
            <Text style={styles.resultTitle}>Сумма процентов:</Text>
            <Text style={styles.resultText}>{formatNumber(totalInterest)} ₽</Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default MortgageCalculator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginTop: 32,
  },
  scrollContainer: {
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    width: width - 32,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  resultContainer: {
    width: width - 32,
    marginTop: 24,
    paddingVertical: 24,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  resultText: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
});
