import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const { width } = Dimensions.get('window');

const MortgageCalculator = () => {
  const [propertyPrice, setPropertyPrice] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [totalPayment, setTotalPayment] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);

  const formatNumber = (value) => {
    const onlyNumbers = value.toString().replace(/\s+/g, '');
    return onlyNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const handlePropertyPriceChange = (text) => {
    setPropertyPrice(formatNumber(text));
  };

  const handleDownPaymentChange = (text) => {
    setDownPayment(formatNumber(text));
  };

  const calculateMortgage = () => {
    const price = parseFloat(propertyPrice.replace(/\s+/g, '')) || 0;
    const down = parseFloat(downPayment.replace(/\s+/g, '')) || 0;
    const term = parseFloat(loanTerm) || 0;
    const rate = parseFloat(interestRate) || 0;

    const loanAmount = price - down; // Сумма кредита
    const monthlyRate = rate / 100 / 12; // Месячная процентная ставка
    const numberOfPayments = term * 12; // Количество платежей

    // Формула расчёта ежемесячного платежа
    const monthly =
      loanAmount *
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    // Общая сумма выплат
    const total = monthly * numberOfPayments;

    // Сумма процентов
    const interest = total - loanAmount;

    setMonthlyPayment(isNaN(monthly) ? 0 : Math.round(monthly));
    setTotalPayment(isNaN(total) ? 0 : Math.round(total));
    setTotalInterest(isNaN(interest) ? 0 : Math.round(interest));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Ипотечный Калькулятор</Text>

        {/* Поле для стоимости недвижимости */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Стоимость недвижимости (₽):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Введите стоимость"
            value={propertyPrice}
            onChangeText={handlePropertyPriceChange}
          />
        </View>

        {/* Поле для первоначального взноса */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Первоначальный взнос (₽):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Введите взнос"
            value={downPayment}
            onChangeText={handleDownPaymentChange}
          />
        </View>

        {/* Поле для срока кредита */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Срок кредита (лет):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Введите срок"
            value={loanTerm}
            onChangeText={(text) => setLoanTerm(text)}
          />
        </View>

        {/* Поле для процентной ставки */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Процентная ставка (%):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Введите ставку"
            value={interestRate}
            onChangeText={(text) => setInterestRate(text)}
          />
        </View>

        {/* Кнопка для расчёта */}
        <TouchableOpacity style={styles.button} onPress={calculateMortgage}>
          <Text style={styles.buttonText}>Рассчитать</Text>
        </TouchableOpacity>

        {/* Результаты */}
        {monthlyPayment !== null && (
          <View style={styles.resultContainer}>
            <View style={{alignItems:'flex-start', marginBottom: 16}}>
            <Text style={styles.resultTitle}>
              Ежемесячный платёж:
            </Text>
            <Text style={styles.resultText}>
               {formatNumber(monthlyPayment)} ₽
            </Text>
            </View>
            <View style={{alignItems:'flex-start', marginBottom: 16}}> 
            <Text style={styles.resultTitle}>
              Общая сумма выплат:
            </Text>
            <Text style={styles.resultText}>
{formatNumber(totalPayment)} ₽
            </Text>
            </View>
            <View style={{alignItems:'flex-start'}}>
            <Text style={styles.resultTitle}>
              Сумма процентов:
            </Text>
            <Text style={styles.resultText}>
   {formatNumber(totalInterest)} ₽
            </Text>
            </View>
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
    marginTop: 32
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
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    width: width-32,
    marginTop: 24,
    paddingVertical: 24,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: 'white',
    alignItems:'flex-start'
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',

    textAlign: 'center',
    marginBottom: 4,
  },
  resultText: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
});
