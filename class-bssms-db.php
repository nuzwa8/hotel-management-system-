<?php
/**
 * BSSMS_DB کلاس
 * ڈیٹا بیس کے تمام محفوظ آپریشنز کو سنبھالنے کے لیے ایک ہیلپر کلاس۔
 * $wpdb->prepare() کا استعمال لازمی ہے (قاعدہ 7: Prepared SQL)۔
 */
class BSSMS_DB {

	/**
	 * سسٹم کی کسی بھی ترتیب کی ویلیو حاصل کریں۔
	 *
	 * @param string $key ترتیب کی کی (Key)۔
	 * @param mixed $default اگر کی نہ ملے تو ڈیفالٹ ویلیو۔
	 * @return mixed
	 */
	public static function get_setting( $key, $default = '' ) {
		global $wpdb;
		$table_settings = $wpdb->prefix . 'bssms_settings';

		$sql = $wpdb->prepare(
			"SELECT setting_value FROM $table_settings WHERE setting_key = %s",
			$key
		);

		$value = $wpdb->get_var( $sql );

		return is_null( $value ) ? $default : $value;
	}

	/**
	 * سسٹم کی کسی بھی ترتیب کی ویلیو کو شامل یا اپ ڈیٹ کریں۔
	 *
	 * @param string $key ترتیب کی کی (Key)۔
	 * @param mixed $value نئی ویلیو۔
	 * @return bool
	 */
	public static function update_setting( $key, $value ) {
		global $wpdb;
		$table_settings = $wpdb->prefix . 'bssms_settings';

		$exists = $wpdb->get_var( $wpdb->prepare(
			"SELECT id FROM $table_settings WHERE setting_key = %s",
			$key
		) );

		if ( $exists ) {
			// اپ ڈیٹ
			$result = $wpdb->update(
				$table_settings,
				array( 'setting_value' => maybe_serialize( $value ) ), // ویلیو کو محفوظ کر رہا ہے۔
				array( 'setting_key' => $key ),
				array( '%s' ),
				array( '%s' )
			);
		} else {
			// شامل کریں (Insert)
			$result = $wpdb->insert(
				$table_settings,
				array(
					'setting_key'   => $key,
					'setting_value' => maybe_serialize( $value ),
				),
				array( '%s', '%s' )
			);
		}

		return (bool) $result;
	}

	/**
	 * تمام فعال کورسز کی فہرست حاصل کریں۔
	 *
	 * @return array
	 */
	public static function get_all_active_courses() {
		global $wpdb;
		$table = $wpdb->prefix . 'bssms_courses';

		// قاعدہ 4: $wpdb->prepare() queries
		$sql = $wpdb->prepare( "SELECT id, course_name_en, course_name_ur, course_fee FROM $table WHERE is_active = %d ORDER BY course_fee DESC", 1 );

		return $wpdb->get_results( $sql, ARRAY_A );
	}

	// 🔴 یہاں پر مزید (DB) فنکشنز (جیسے ایڈمیشن کو بچانا) بعد میں شامل ہوں گے۔
}

// ✅ Syntax verified block end
