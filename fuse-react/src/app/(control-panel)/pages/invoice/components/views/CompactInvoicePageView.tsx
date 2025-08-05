'use client';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';

/**
 * The compact invoice page.
 */
function CompactInvoicePageView() {
	return (
		<div className="inline-block w-full overflow-auto p-6 text-left sm:p-10 print:p-0">
			<motion.div
				initial={{ opacity: 0, y: 200 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ bounceDamping: 0 }}
			>
				<Card className="mx-auto w-3xl rounded-xl p-16 shadow-sm print:w-auto print:rounded-none print:bg-transparent print:shadow-none">
					<CardContent>
						<div className="flex items-start justify-between">
							<div className="grid grid-cols-2 gap-x-4 gap-y-0.25">
								<Typography
									className="text-4xl tracking-tight"
									color="text.secondary"
								>
									INVOICE
								</Typography>
								<Typography className="text-4xl">#9-0004</Typography>
								<Typography
									className="font-medium tracking-tight"
									color="text.secondary"
								>
									INVOICE DATE
								</Typography>
								<Typography className="font-medium">Jul 19, 2022</Typography>
								<Typography
									className="font-medium tracking-tight"
									color="text.secondary"
								>
									DUE DATE
								</Typography>
								<Typography className="font-medium">Aug 19, 2022</Typography>
								<Typography
									className="font-medium tracking-tight"
									color="text.secondary"
								>
									TOTAL DUE
								</Typography>
								<Typography className="font-medium">$235,000.00</Typography>
							</div>

							<Box
								sx={(theme) => ({
									backgroundColor: theme.vars.palette.primary.dark,
									color: theme.palette.getContrastText(theme.palette.primary.dark)
								})}
								className="-mr-16 grid auto-cols-max grid-flow-col gap-x-8 rounded-l-2xl px-8 py-6"
							>
								<div className="w-24 place-self-center">
									<img
										className="w-24"
										src="/assets/images/logo/logo.svg"
										alt="logo"
									/>
								</div>
								<Box
									className="text-md border-l pl-10"
									sx={{
										borderColor: (theme) =>
											alpha(theme.palette.getContrastText(theme.palette.primary.dark), 0.25)
									}}
								>
									<Typography className="font-medium">Fuse Inc.</Typography>
									<Typography>2810 Country Club Road</Typography>
									<Typography>Cranford, NJ 07016</Typography>
									<Typography>+66 123 455 87</Typography>
									<Typography>hello@fuseinc.com</Typography>
									<Typography>www.fuseinc.com</Typography>
								</Box>
							</Box>
						</div>

						<div className="text-md">
							<Typography className="text-xl font-medium">Brian Hughes</Typography>
							<Typography>9301 Wood Street Philadelphia, PA 19111</Typography>
							<Typography>hughes.brian@company.com</Typography>
							<Typography>+55 552 455 87</Typography>
						</div>

						<div className="mt-12 grid grid-cols-12 gap-x-1">
							<div
								className="text-md col-span-8 font-medium"
								color="text.secondary"
							>
								SERVICE
							</div>
							<div
								className="text-md text-right font-medium"
								color="text.secondary"
							>
								RATE
							</div>
							<div
								className="text-md text-right font-medium"
								color="text.secondary"
							>
								QTY
							</div>
							<div
								className="text-md col-span-2 text-right font-medium"
								color="text.secondary"
							>
								TOTAL
							</div>

							<div className="col-span-12 my-4 border-b" />

							<Typography className="col-span-8 text-lg font-medium">Prototype & Design</Typography>
							<Typography className="self-center text-right">$75.00</Typography>
							<Typography className="self-center text-right">240</Typography>
							<Typography className="col-span-2 self-center text-right">$18,000.00</Typography>

							<div className="col-span-12 my-4 border-b" />

							<Typography className="col-span-8 text-lg font-medium">Development</Typography>
							<Typography className="self-center text-right">$60.50</Typography>
							<Typography className="self-center text-right">350</Typography>
							<Typography className="col-span-2 self-center text-right">$21,175.00</Typography>

							<div className="col-span-12 my-4 border-b" />

							<Typography className="col-span-8 text-lg font-medium">Testing</Typography>
							<Typography className="self-center text-right">$25.00</Typography>
							<Typography className="self-center text-right">50</Typography>
							<Typography className="col-span-2 self-center text-right">$1,250.00</Typography>

							<div className="col-span-12 my-4 border-b" />

							<Typography className="col-span-8 text-lg font-medium">Documentation & Training</Typography>
							<Typography className="self-center text-right">$26.50</Typography>
							<Typography className="self-center text-right">260</Typography>
							<Typography className="col-span-2 self-center text-right">$6,890.00</Typography>

							<div className="col-span-12 my-4 border-b" />

							<div className="col-span-8 text-lg font-medium">Critical bug fixes for a year</div>
							<div className="self-center text-right">$25,000</div>
							<div className="self-center text-right">2</div>
							<div className="col-span-2 self-center text-right">$50,000.00</div>

							<div className="col-span-12 my-4 border-b" />

							<Typography className="col-span-8 text-lg font-medium">
								Extended security updates for a year
							</Typography>
							<Typography className="self-center text-right">$15.000</Typography>
							<Typography className="self-center text-right">2</Typography>
							<Typography className="col-span-2 self-center text-right">$30,000.00</Typography>

							<div className="col-span-12 my-4 border-b" />

							<Typography className="col-span-8 text-lg font-medium">
								Extended updates for a year
							</Typography>
							<Typography className="self-center text-right">$50.000</Typography>
							<Typography className="self-center text-right">2</Typography>
							<Typography className="col-span-2 self-center text-right">$100,000.00</Typography>

							<div className="col-span-12 mt-16" />

							<Typography
								className="col-span-10 self-center font-medium tracking-tight"
								color="text.secondary"
							>
								SUBTOTAL
							</Typography>
							<Typography className="col-span-2 text-right text-lg">$227,315.00</Typography>

							<div className="col-span-12 my-3 border-b" />

							<Typography
								className="col-span-10 self-center font-medium tracking-tight"
								color="text.secondary"
							>
								TAX
							</Typography>
							<Typography className="col-span-2 text-right text-lg">$11,365.75</Typography>

							<div className="col-span-12 my-3 border-b" />

							<Typography
								className="col-span-10 self-center font-medium tracking-tight"
								color="text.secondary"
							>
								DISCOUNT
							</Typography>
							<Typography className="col-span-2 text-right text-lg">$3,680.75</Typography>

							<div className="col-span-12 my-3 border-b" />

							<Typography
								className="col-span-10 self-center text-2xl font-medium tracking-tight"
								color="text.secondary"
							>
								TOTAL
							</Typography>
							<div className="col-span-2 text-right text-2xl font-medium">$235,000.00</div>
						</div>

						<div className="mt-16">
							<Typography className="font-medium">
								Please pay within 15 days. Thank you for your business.
							</Typography>
							<div className="mt-4 flex items-start">
								<img
									className="mt-2 w-9 shrink-0"
									src="/assets/images/logo/logo.svg"
									alt="logo"
								/>
								<Typography
									className="ml-6 text-sm"
									color="text.secondary"
								>
									In condimentum malesuada efficitur. Mauris volutpat placerat auctor. Ut ac congue
									dolor. Quisque scelerisque lacus sed feugiat fermentum. Cras aliquet facilisis
									pellentesque. Nunc hendrerit quam at leo commodo, a suscipit tellus dapibus. Etiam
									at felis volutpat est mollis lacinia. Mauris placerat sem sit amet velit mollis, in
									porttitor ex finibus. Proin eu nibh id libero tincidunt lacinia et eget.
								</Typography>
							</div>
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
}

export default CompactInvoicePageView;

/**

 Use the following elements to add breaks to your pages. This will make sure that the section in between
 these elements will be printed on a new page. The following two elements must be used before and after the
 page content that you want to show as a new page. So, you have to wrap your content with them.

 Elements:
 ---------
 <div className="page-break-after"></div>
 <div className="page-break-before"></div>

 Example:
 --------

 Initial page content!

 <div className="page-break-after"></div>
 <div className="page-break-before"></div>

 This is the second page!

 <div className="page-break-after"></div>
 <div className="page-break-before"></div>

 This is the third page!

 <div className="page-break-after"></div>
 <div className="page-break-before"></div>
 * */
