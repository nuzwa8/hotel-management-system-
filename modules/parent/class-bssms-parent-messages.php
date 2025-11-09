<?php
/**
 * BSSMS Parent 'Messages & Announcements' Page
 *
 * @package BSSMS
 */

// 🟢 یہاں سے [Parent Messages Class] شروع ہو رہا ہے
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * 'پیغامات اور اعلانات' پیج کو رینڈر (render) کرتا ہے۔
 * سخت پابندی: اس فائل میں صرف लेआउट (layout) شامل ہے۔ کوئی AJAX یا DB کالز نہیں ہیں۔
 */
class BSSMS_Parent_Messages {

	/**
	 * صفحہ کو رینڈر کرتا ہے۔
	 */
	public static function render_page() {

		// 🟢 یہاں سے [Page Root] شروع ہو رہا ہے
		?>
		<div id="bssms-parent-messages-root" class="bssms-root" data-screen="messages">
			<p>Loading Messages & Announcements...</p>
		</div>
		<?php
		// 🔴 یہاں پر [Page Root] ختم ہو رہا ہے

		// 🟢 یہاں سے [Page Template] شروع ہو رہا ہے
		?>
		<template id="bssms-parent-messages-template">
			<div class="bssms-parent-messages">
				
				<div class="bssms-page-header">
					<h1><?php _e( 'Messages & Announcements', 'bssms' ); ?></h1>
					<div class="bssms-header-actions">
						<button class="bssms-btn bssms-btn-primary"><?php _e( 'Mark All Read', 'bssms' ); ?></button>
						<button class="bssms-btn bssms-btn-secondary"><?php _e( 'New Message', 'bssms' ); ?></button>
					</div>
				</div>

				<div class="bssms-breadcrumbs">
					<span><?php _e( 'Dashboard', 'bssms' ); ?></span> &gt; 
					<span><?php _e( 'Messages & Announcements', 'bssms' ); ?></span>
				</div>

				<div class="bssms-tabs-toolbar">
					<ul class="bssms-tabs">
						<li class="tab-item active"><a href="#inbox"><?php _e( 'Inbox', 'bssms' ); ?></a></li>
						<li class="tab-item"><a href="#sent"><?php _e( 'Sent', 'bssms' ); ?></a></li>
						<li class="tab-item"><a href="#announcements"><?php _e( 'Announcements', 'bssms' ); ?></a></li>
						<li class="tab-item"><a href="#ptm-notices"><?php _e( 'PTM Notices', 'bssms' ); ?></a></li>
						<li class="tab-item"><a href="#archived"><?php _e( 'Archived', 'bssms' ); ?></a></li>
					</ul>
				</div>

				<div class="bssms-messages-layout">
					
					<div class="bssms-messages-list-col">
						<div class="search-box">
							<input type="text" placeholder="<?php _e( 'Search Messages...', 'bssms' ); ?>" />
							<span class="icon-search"></span>
						</div>

						<div class="bssms-tabs-toolbar-inner">
							<ul class="bssms-tabs-inner">
								<li class="tab-item active"><a href="#unread"><?php _e( 'Unread Messages', 'bssms' ); ?> (4)</a></li>
								<li class="tab-item"><a href="#alerts"><?php _e( 'Alerts Enabled', 'bssms' ); ?></a></li>
							</ul>
						</div>

						<ul class="message-list-items">
							</ul>
					</div>

					<div class="bssms-messages-chat-col">
						<div class="chat-header">
							<img src="" alt="Mrs. Sara Malik" class="avatar" />
							<div class="chat-user-info">
								<h4><?php _e( 'Mrs. Sara Malik (Math Teacher)', 'bssms' ); ?></h4>
								<span><?php _e( 'Last seen...', 'bssms' ); ?></span>
							</div>
							<div class="chat-actions">
								<button class="icon-button" aria-label="<?php _e('Reply', 'bssms'); ?>"></button>
								<button class="icon-button" aria-label="<?php _e('Archive', 'bssms'); ?>"></button>
								<button class="icon-button" aria-label="<?php _e('Delete', 'bssms'); ?>"></button>
							</div>
						</div>

						<div class="chat-body">
							<div class="message-bubble sender">
								<p><?php _e( 'Dear Parents, The homework for... ', 'bssms' ); ?></p>
								<span class="timestamp"><?php _e( '9:45 AM', 'bssms' ); ?></span>
							</div>
							<div class="message-bubble receiver">
								<p><?php _e( 'Okay, Thank for the update.', 'bssms' ); ?></p>
								<span class="timestamp"><?php _e( '9:47 AM', 'bssms' ); ?></span>
							</div>
						</div>

						<div class="chat-reply-box">
							<input type="text" placeholder="<?php _e( 'Type your message...', 'bssms' ); ?>" />
							<button class="icon-button" aria-label="<?php _e('Attach file', 'bssms'); ?>"></button>
							<button class="icon-button" aria-label="<?php _e('Send voice', 'bssms'); ?>"></button>
							<button class="bssms-btn bssms-btn-primary"><?php _e( 'Send', 'bssms' ); ?></button>
						</div>
					</div>

					<div class="bssms-messages-settings-col">
						<div class="bssms-widget-card" id="widget-notification-settings">
							<h3 class="widget-title"><?php _e( 'Notification Settings', 'bssms' ); ?></h3>
							<form>
								<label>
									<input type="checkbox" checked />
									<?php _e( 'Message Alerts', 'bssms' ); ?>
								</label>
								<label>
									<input type="checkbox" />
									<?php _e( 'Announcement Alerts', 'bssms' ); ?>
								</label>
								<label>
									<input type="checkbox" checked />
									<?php _e( 'PTM Reminders', 'bssms' ); ?>
								</label>
								<label>
									<input type="checkbox" />
									<?php _e( 'SMS', 'bssms' ); ?>
								</label>
								
								<label for="quiet-hours"><?php _e( 'Quiet Hours', 'bssms' ); ?></label>
								<input type="text" id="quiet-hours" value="10:00 PM - 7:00 AM" />
							</form>
						</div>
					</div>

				</div>

			</div>
		</template>
		<?php
		// 🔴 یہاں پر [Page Template] ختم ہو رہا ہے
	}
}
// 🔴 یہاں پر [Parent Messages Class] ختم ہو رہا ہے

// ✅ Syntax verified block end.
