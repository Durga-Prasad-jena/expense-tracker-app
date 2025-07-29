import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import FormInput from '@/components/FormInput'
import Header from '@/components/Header'
import ImageUpload from '@/components/ImageUpload'
import ModalWrapper from '@/components/ModalWrapper'
import Typo from '@/components/Typo'
import { expenseCategories, transactionTypes } from '@/constants/data'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/contexts/authContext'
import useFetchData from '@/hooks/useFetchData'
import { createOrUpdateTransaction, deleteTransaction } from '@/services/transactionService'
import { TransactionType, WalletType } from '@/types'
import { verticalScale } from '@/utils/styling'
import AntDesign from '@expo/vector-icons/AntDesign'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { orderBy, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import {
    Alert,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import { widthPercentageToDP } from 'react-native-responsive-screen'

export type oldTransactionProps = {
    id: string
    image?: string
    type: string
    amount: string
    description: string,
    category?: string,
    walletId: string,
    date: string,
    uid?: string
}

const TransactionModal = () => {
    const [transaction, setTransaction] = useState<TransactionType>({
        amount: 0,
        date: new Date(),
        type: 'expense',
        walletId: '',
        category: '',
        description: '',
        id: '',
        image: ''
    })
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [loading, setLoading] = useState<boolean>(false)
    const { user } = useAuth()
    const router = useRouter()
    const {
        data: wallets,
        error,
        loading: isWalletLoading
    } = useFetchData<WalletType>('wallets', [
        where('uid', '==', user?.uid),
        orderBy('created', 'desc')
    ])

    const onDateChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || transaction.date
        setTransaction({ ...transaction, date: currentDate })
        setShowDatePicker(Platform.OS === 'ios' ? true : false)
    }

    const oldTransaction: oldTransactionProps = useLocalSearchParams()
    useEffect(() => {
        if (oldTransaction.id) {
            setTransaction({
                image: oldTransaction?.image,
                id: oldTransaction.id,
                type: oldTransaction?.type,
                amount: Number(oldTransaction.amount),
                category: oldTransaction?.category,
                walletId: oldTransaction.walletId,
                date: new Date(oldTransaction.date),
                description: oldTransaction?.description
            });
        }
    }, [])

    const handleDelete = async () => {
        if (!oldTransaction?.id) return;
        setLoading(true);
        const res = await deleteTransaction(oldTransaction?.id,oldTransaction.walletId);
        setLoading(false);
        if (res.success) {
          Alert.alert("Delete", res?.msg || "Wallet Deleted Succfully!");
          router.back();
        }
    }

    const showDeleteAlert = () => {
        Alert.alert(
            "Confirm",
            "Are you sure you want to delete!",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    onPress: handleDelete,
                    style: "destructive",
                },
            ]
        );
    }

    const handleUpdateWallet = async () => {
        const { amount, date, type, walletId, category, description, image } =
            transaction
        if (
            !amount ||
            !date ||
            !walletId ||
            (transaction.type == 'expense' && !category)
        ) {
            Alert.alert('Transaction', 'Please fill all the fields')
            return
        }

        const transactionData: TransactionType = {
            amount,
            date,
            type,
            walletId,
            description,
            image,
            uid: user?.uid,
            category
        }
        setLoading(true)
        if (oldTransaction.id) transactionData.id = oldTransaction.id;
        const res = await createOrUpdateTransaction(transactionData)

        if (res.success) {
            router.back()
        } else {
            setLoading(false)
            Alert.alert('Transaction', res.msg)
        }
    }

    return (
        <ModalWrapper>
            <View style={styles.container}>
                <Header
                    title={oldTransaction.id ? 'Update Wallet' : 'Add wallet'}
                    leftIcon={<BackButton />}
                    style={{ marginBottom: spacingY._10 }}
                />
                <ScrollView
                    contentContainerStyle={styles.form}
                    showsVerticalScrollIndicator={false}
                >
                    {/* type? */}
                    <View style={styles.dropdownContainer}>
                        <Typo size={14}>Type</Typo>
                        <Dropdown
                            style={styles.dropdown}
                            activeColor={colors.neutral700}
                            selectedTextStyle={styles.selectedTextStyle}
                            iconStyle={styles.iconStyle}
                            data={transactionTypes}
                            maxHeight={300}
                            placeholderStyle={styles.placeHolderTextStyle}
                            labelField='label'
                            placeholder='Select Expense'
                            valueField='value'
                            itemContainerStyle={styles.dropdownContainerContainer}
                            itemTextStyle={styles.dropDownItemTextStyle}
                            showsVerticalScrollIndicator={false}
                            containerStyle={styles.itemsListStyle}
                            value={transaction.type}
                            onChange={item => {
                                setTransaction({ ...transaction, type: item.value || '' })
                            }}
                        />
                    </View>
                    {/* wallet? */}
                    <View style={styles.dropdownContainer}>
                        <Typo size={14}>Wallet</Typo>
                        <Dropdown
                            style={styles.dropdown}
                            activeColor={colors.neutral700}
                            selectedTextStyle={styles.selectedTextStyle}
                            iconStyle={styles.iconStyle}
                            data={wallets.map(wallet => ({
                                label: `${wallet?.name} ($${wallet?.amount})`,
                                value: wallet?.id
                            }))}
                            maxHeight={300}
                            labelField='label'
                            valueField='value'
                            placeholder='Select Wallets'
                            placeholderStyle={styles.placeHolderTextStyle}
                            itemContainerStyle={styles.dropdownContainerContainer}
                            itemTextStyle={styles.dropDownItemTextStyle}
                            showsVerticalScrollIndicator={false}
                            containerStyle={styles.itemsListStyle}
                            value={transaction.walletId}
                            onChange={item => {
                                setTransaction({ ...transaction, walletId: item.value })
                            }}
                        />
                    </View>

                    {/* expense category? */}
                    {transaction.type == 'expense' && (
                        <View style={styles.dropdownContainer}>
                            <Typo size={14}>Category</Typo>
                            <Dropdown
                                style={styles.dropdown}
                                activeColor={colors.neutral700}
                                selectedTextStyle={styles.selectedTextStyle}
                                iconStyle={styles.iconStyle}
                                data={Object.values(expenseCategories)}
                                maxHeight={300}
                                labelField='label'
                                valueField='value'
                                placeholder='Select category'
                                placeholderStyle={styles.placeHolderTextStyle}
                                itemContainerStyle={styles.dropdownContainerContainer}
                                itemTextStyle={styles.dropDownItemTextStyle}
                                showsVerticalScrollIndicator={false}
                                containerStyle={styles.itemsListStyle}
                                value={transaction.category}
                                onChange={item => {
                                    setTransaction({ ...transaction, category: item.value || '' })
                                }}
                            />
                        </View>
                    )}
                    {/* /date picker */}
                    <View style={styles.inputContainer}>
                        <Typo size={14}>Date</Typo>
                        {!showDatePicker && (
                            <Pressable
                                style={styles.dateInput}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Typo size={14}>
                                    {(transaction.date as Date).toLocaleDateString()}
                                </Typo>
                            </Pressable>
                        )}
                        {showDatePicker && (
                            <View style={Platform.OS === 'ios' && styles.iosDatePicker}>
                                <DateTimePicker
                                    value={transaction.date as Date}
                                    textColor={colors.white}
                                    mode='date'
                                    onChange={onDateChange}
                                    themeVariant='dark'
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                />
                                {Platform.OS === 'ios' && (
                                    <TouchableOpacity
                                        onPress={() => {
                                            setShowDatePicker(false)
                                        }}
                                    >
                                        <Typo>ok</Typo>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                    </View>
                    {/* amount */}

                    <View style={styles.inputContainer}>
                        <Typo size={14}>Amount</Typo>
                        <FormInput
                            placeHolder='Enter Amount'
                            value={transaction.amount.toString()}
                            onChangeText={value =>
                                setTransaction({
                                    ...transaction,
                                    amount: Number(value.replace(/[^0-9]/g, ''))
                                })
                            }
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <View style={styles.flexrow}>
                            <Typo size={14}>Description</Typo>
                            <Typo size={14} color={colors.neutral600}>
                                (Optional)
                            </Typo>
                        </View>
                        <FormInput
                            placeHolder='Enter Amount'
                            value={transaction.description}
                            onChangeText={value =>
                                setTransaction({ ...transaction, description: value })
                            }
                            multiline={true}
                            containerStyle={{
                                flexDirection: 'row',
                                height: verticalScale(100),
                                alignItems: 'flex-start'
                            }}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <View style={styles.flexrow}>
                            <Typo size={14}>Reciept</Typo>
                            <Typo size={14} color={colors.neutral600}>
                                (Optional)
                            </Typo>
                        </View>
                        <ImageUpload
                            onSelect={file => setTransaction({ ...transaction, image: file })}
                            onClear={() => setTransaction({ ...transaction, image: '' })}
                            file={transaction.image}
                            placeHolder='Upload Image'
                        />
                    </View>
                </ScrollView>
                <View style={styles.footer}>
                    {oldTransaction?.id && !loading && (
                        <Button
                            onPress={showDeleteAlert}
                            style={{
                                paddingHorizontal: spacingY._12,
                                backgroundColor: colors.rose,
                            }}
                        >
                            <AntDesign name='delete' size={24} color={colors.white} />
                        </Button>
                    )}

                    <Button
                        loading={loading}
                        onPress={handleUpdateWallet}
                        style={{ width: oldTransaction.id ? "84%" : "100%" }}
                    >
                        <Typo color={colors.neutral800} size={18} fontWeight={'700'}>
                            {oldTransaction.id ? 'Update Transaction' : 'Add Transaction'}
                        </Typo>
                    </Button>

                </View>
            </View>
        </ModalWrapper>
    )
}

export default TransactionModal

const styles = StyleSheet.create({
    container: {
        flex: 1
        // marginBottom: 100,
    },
    form: {
        marginTop: spacingY._15,
        gap: spacingY._30,
        paddingBottom: 100
    },

    inputContainer: {
        gap: spacingY._10,
        marginHorizontal: widthPercentageToDP(5)
    },
    footer: {
        flexDirection: 'row',
        position: 'absolute',
        alignSelf: 'center',
        bottom: 10,
        marginHorizontal: spacingX._15,
        gap: 10
    },

    dropdownContainer: {
        backgroundColor: colors.neutral800,
        width: '90%',
        alignSelf: 'center',
        borderRadius: radius._10,
        gap: 10
    },
    dropdown: {
        height: verticalScale(54),
        borderColor: colors.neutral300,
        paddingHorizontal: spacingX._15,
        borderWidth: 0.5,
        borderRadius: radius._10,
        borderCurve: 'continuous'
    },
    selectedTextStyle: {
        color: colors.white,
        fontSize: verticalScale(14)
    },
    iconStyle: {
        tintColor: colors.white,
        height: verticalScale(26)
    },
    dropdownContainerContainer: {
        //    marginHorizontal:spacingY._15,
        //    borderRadius:radius._15
    },
    dropDownItemTextStyle: {
        color: colors.neutral300
    },
    itemsListStyle: {
        backgroundColor: colors.neutral800,
        borderRadius: radius._15,
        borderCurve: 'continuous',
        paddingVertical: spacingY._7,
        top: 5,
        borderColor: colors.neutral500,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 1,
        shadowRadius: 15,
        elevation: 5
    },
    placeHolderTextStyle: {
        color: colors.neutral300
    },
    dateInput: {
        borderColor: colors.neutral400,
        borderWidth: 1,
        padding: spacingY._10,
        borderRadius: radius._12,
        backgroundColor: colors.neutral800
    },
    iosDatePicker: {},
    flexrow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    }
})
