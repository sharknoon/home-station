<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<form use:enhance>
	<label for="name">Name:</label><br />
	<input type="text" id="name" name="name" required /><br />
	<label for="description">Description:</label><br />
	<input type="text" id="description" name="description" required /><br />
	<label for="icon-url">Icon URL:</label><br />
	<input type="text" id="icon-url" name="icon-url" required /><br />
	<label for="icon-file">Icon File:</label><br />
	<input type="file" id="icon-file" name="icon-file" /><br />
	<label for="banner-url">Banner URL:</label><br />
	<input type="text" id="banner-url" name="banner-url" /><br />
	<label for="banner-file">Banner File:</label><br />
	<input type="file" id="banner-file" name="banner-file" /><br />
	<label for="repository">Repository:</label><br />
	<input type="text" id="repository" name="repository" required /><br />
	<label for="website">Website:</label><br />
	<input type="text" id="website" name="website" required /><br />
	TODO custom links<br />
	

	<br /><input type="submit" value="Submit" />
</form>
