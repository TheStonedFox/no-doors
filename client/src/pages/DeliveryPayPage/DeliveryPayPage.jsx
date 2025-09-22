import Location from '../../components/Location/Location'
import styles from './DeliveryPayPage.module.css'

export default function DeliveryPayPage() {
    return (
        <section className={`${styles['delivery-pay-page']} container`}>
            <Location path='delivery-and-pay' />
            <h2 className={`${'section-title'} ${styles['delivery-pay-page__title']}`}>Доставка и оплата</h2>

            <div className={styles['delivery-pay-page__content']}>
                <section className={styles['delivery-pay-page__chapter']}>
                    <h3 className={styles['chapter__title']}>Условия бесплатной доставки</h3>
                    <div className={styles['chapter__text']}>
                        <ul>
                            <li> — Бесплатная доставка нашей курьерской службой по Киеву при заказе от 500 гривен.</li>
                            <li> — Бесплатная доставка* при заказах от 6 000 гривен.</li>
                        </ul>
                        * Данная услуга предоставляется по минимальным тарифам транспортных компаний.
                        Если вам нужен более быстрый способ доставки, свяжитесь с нашим менеджером и он поможет подобрать самый удобный и выгодный способ доставки.
                        В этом случае вам нужно будет оплатить только разницу между обычной и более быстрой доставкой.
                    </div>
                </section>

                <section className={styles['delivery-pay-page__chapter']}>
                    <h3 className={styles['chapter__title']}>Самовывоз</h3>
                    <div className={styles['chapter__text']}>
                        <p>Вы можете забрать свой заказ самостоятельно в любом из наших магазинов.</p>
                    </div>
                </section>

                <section className={styles['delivery-pay-page__chapter']}>
                    <h3 className={styles['chapter__title']}>Оплата наличными курьеру при доставке
                    </h3>
                    <div className={styles['chapter__text']}>
                        <p>Вы можете оплатить свой заказ наличными курьеру. Выберите при оформлении заказа на сайте соответствующий способ оплаты.
                            Курьер выдаст вам документы, подтверждающие оплату и получение товара.
                        </p>
                    </div>
                </section>


                <section className={styles['delivery-pay-page__chapter']}>
                    <h3 className={styles['chapter__title']}>Что делать при отказе в авторизации платежа?</h3>
                    <div className={styles['chapter__text']}>
                        <ul>
                            <li>— Повторите попытку через 20 минут;</li>
                            <li> — Обратитесь в банк-эмитент;</li>
                            <li>— Попробуйте оплатить картой другого банка.</li>

                        </ul>
                    </div>
                </section>

                <p>* Вы будете перенаправлены на платежный шлюз LigPay. Соединение с платежным шлюзом и передача информации осуществляется в защищенном режиме с использованием протокола шифрования SSL. В случае если Ваш банк поддерживает технологию безопасного проведения интернет-платежей Verified By Visa или MasterCard SecureCode для проведения платежа также может потребоваться ввод специального пароля.</p>
            </div>

        </section>
    )
}
